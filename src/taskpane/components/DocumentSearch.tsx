import * as React from "react";
import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { nanoid } from "nanoid";
import { insertText } from "../taskpane";
import { DOCUMENT_SEARCH, PAGINATED_SEARCH } from '../schemas.js';

interface Paper {
    title: string;
    authors: any[];
    year: number;
}

//type Keyword = string;

const DocumentSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [foundPapers, setFoundPapers] = useState<Paper[] | null>(null);
    const [keywords, setKeywords] = useState('');

    const [getDocuments, { loading: loadingDocs, error: errorDocs, data: dataDocs }] = useLazyQuery(DOCUMENT_SEARCH);
    const [getPaperMeta, { loading: loadingMeta, error: errorMeta, data: dataMeta }] = useLazyQuery(PAGINATED_SEARCH);

    // Load values from localStorage when the component first renders
    const [apiKey, setApiKey] = useState(localStorage.getItem("zotero_api_key") || "");
    const [userId, setUserId] = useState(localStorage.getItem("zotero_user_id") || "");

    // Update localStorage immediately when the user types
    const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newKey = e.target.value;
        setApiKey(newKey);
        localStorage.setItem("zotero_api_key", newKey);
    };

    const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newId = e.target.value;
        setUserId(newId);
        localStorage.setItem("zotero_user_id", newId);
    };

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
                                    year: paper.PublicationDate.Year
                                }
                            ));
                            setFoundPapers(convertedPapers)
                        })
                }
            })
            .catch(error => console.error("GraphQL Error:", error));
    };

    const addToZotero = async () => {
        if (!apiKey || !userId) {
            console.log("Please enter your Zotero API Key and User ID first.");
            return;
        }

        const paper = {
            itemType: "journalArticle",
            title: "Paper title",
            creators: [{ firstName: "Alon", lastName: "Cohen", creatorType: "author" }],
            publicationTitle: "Journal for Genius",
            date: "2024",
            url: "https://example.com/paper.pdf",
            tags: [{ tag: "NLP" }, { tag: "AI" }]
        };

        const response = await fetch(`https://api.zotero.org/users/${userId}/items`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify([paper])
        });

        if (response.ok) {
            console.log("Item added to Zotero!");
        } else {
            console.error("Failed to add item:", await response.text());
        }
    };


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

    return (
        <>
            <div className="search-container">
                <h3>Discover</h3>

                <div className="search-container">
                    <h3>Enter Zotero Credentials</h3>
                    <input
                        className="input"
                        type="text"
                        placeholder="Enter your API key..."
                        value={apiKey}
                        onChange={handleApiKeyChange}
                    />
                    <input
                        className="input"
                        type="text"
                        placeholder="Enter your User ID..."
                        value={userId}
                        onChange={handleUserIdChange}
                    />
                    <p>Stored API Key: {apiKey ? apiKey : "Not set"}</p>
                    <p>Stored User ID: {userId ? userId : "Not set"}</p>
                </div>

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
                    <button onClick={() => insertText(paper)}>Insert</button>
                    <button onClick={addToZotero}>Add to Zotero</button>
                </div>
            ))}
        </>
    );

};

export default DocumentSearch;