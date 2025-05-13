import * as React from "react";
import { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { nanoid } from "nanoid";
import { insertText } from "../taskpane";
import { DOCUMENT_SEARCH, PAGINATED_SEARCH, ADD_PAPER_TO_ZOTERO } from '../schemas.js';

interface Paper {
    title: string;
    authors: any[];
    year: number;
    collection: string;
    id_field: number;
    id_type: number;
    id_value: number
}

//type Keyword = string

const DocumentSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [foundPapers, setFoundPapers] = useState<Paper[] | null>(null);
    const [keywords, setKeywords] = useState('');

    const [getDocuments, { loading: loadingDocs, error: errorDocs, data: dataDocs }] = useLazyQuery(DOCUMENT_SEARCH);
    const [getPaperMeta, { loading: loadingMeta, error: errorMeta, data: dataMeta }] = useLazyQuery(PAGINATED_SEARCH);
    const [addPaperToZotero, { loading, error, data }] = useMutation(ADD_PAPER_TO_ZOTERO)

    const handleClickSearchBtn = () => {
        getDocuments({
            variables: {
                ranking_variable: searchTerm,
                keywords: keywords
            }
        })
            .then(result => {
                if (result.data) {
                    getPaperMeta({
                        variables: {
                            paper_list: result.data.documentSearch.response.paper_list,
                            keywords: keywords
                        }
                    })
                        .then(result => {
                            console.log(result.data.paginatedSearch.response)
                            const fetchedPapers = result.data.paginatedSearch.response
                            const convertedPapers = fetchedPapers.map( paper => (
                                {
                                    title: paper.Title,
                                    authors: paper.Author,
                                    year: paper.PublicationDate.Year,
                                    collection: "S2AG",
                                    id_field: "id_int",
                                    id_type: "int",
                                    id_value: paper.id_int.toString()
                                }
                            ));
                            setFoundPapers(convertedPapers)
                        })
                }
            })
            .catch(error => console.error("GraphQL Error:", error));
    };

    const handleClickZoteroBtn = async (paperIDValue)=> {
        try {
            const result = await addPaperToZotero({
                variables: {
                    zoteroCollectionId: 'Endoc Word Add-In Collection',
                    paper: {
                        collection: 'S2AG',
                        id_field: 'id_int',
                        id_type: 'int',
                        id_value: paperIDValue,
                    },
                },
            })
            console.log('Zotero response:', result.data.addPaperToZotero)
        } catch (e) {
            console.error('Mutation error:', e)
        }
    }


    useEffect(() => {
        // Function to handle storage updates
        const handleStorageChange = () => {
            const newSearchTerm = localStorage.getItem("searchTerm") || "";

            if (newSearchTerm) {
                setSearchTerm(newSearchTerm);
                localStorage.removeItem("searchTerm");
            }
        };

        // Listen for storage events
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);



    async function fetchGraphQL() {
        const url = "https://localhost:3001/proxy"
        //const url = "https://se-staging.ee.ethz.ch/graphql"
        const apiKey = "";
        const query = {
            query: "mutation {\n" +
                "  addPaperToZotero(\n" +
                "    zoteroCollectionId: \"cs_project\"\n" +
                "    paper: {\n" +
                "      collection: \"S2AG\"\n" +
                "      id_field: \"id_int\"\n" +
                "      id_type: \"int\"\n" +
                "      id_value: \"7751943\"\n" +
                "    }\n" +
                "  ) {\n" +
                "    status\n" +
                "    message\n" +
                "  }\n" +
                "}"
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                },
                body: JSON.stringify(query)
            });

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }


    return (
        <>
            <div className="search-container">
                <button onClick={fetchGraphQL}>Test Query</button>
                <h3>Discover</h3>

                <fieldset className="fieldset">
                    <legend className="legend">Semantic Search</legend>
                    <input
                        className="input"
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="legend">Content based filter</legend>
                    <input
                        className="input"
                        type="text"
                        placeholder="Enter keywords..."
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                    />
                </fieldset>
                <button className="search-btn" onClick={handleClickSearchBtn}>Search</button>
            </div>

            {foundPapers?.map(paper => (
                <div className="result" key={nanoid()}>
                    <h3>{paper.title}</h3>
                    <p>Authors: {paper.authors.map(author => `${author?.FamilyName}, ${author?.GivenName[0]}. `)}</p>
                    <p>Year: {paper.year}</p>
                    <p>
                        {JSON.stringify(paper)}
                    </p>
                    <button onClick={() => insertText(paper)}>Insert</button>
                    <button onClick={() => handleClickZoteroBtn(paper.id_value)}>Add to Zotero</button>
                </div>
            ))}
        </>
    );

};

export default DocumentSearch;