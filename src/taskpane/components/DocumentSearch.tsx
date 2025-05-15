import * as React from "react";
import { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { nanoid } from "nanoid";
import { DOCUMENT_SEARCH, PAGINATED_SEARCH, ADD_PAPER_TO_ZOTERO } from '../schemas.js';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

interface Paper {
    title: string;
    authors: any[];
    year: number;
    collection: string;
    id_field: number;
    id_type: number;
    id_value: number
}

const DocumentSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [foundPapers, setFoundPapers] = useState<Paper[] | null>(null);
    const [keywords, setKeywords] = useState('');
    const [loadingBar, setloadingBar] = useState(false);

    const [getDocuments, { loading: loadingDocs, error: errorDocs, data: dataDocs }] = useLazyQuery(DOCUMENT_SEARCH);
    const [getPaperMeta, { loading: loadingMeta, error: errorMeta, data: dataMeta }] = useLazyQuery(PAGINATED_SEARCH);
    const [addPaperToZotero, { loading, error, data }] = useMutation(ADD_PAPER_TO_ZOTERO)

    const handleClickSearchBtn = async () => {
        if (!localStorage.getItem("x_api_key")){
            toast.error('Please provide a valid API key first.', {
                icon: <span role="img" aria-label="warning">⚠️</span>,
            });
            return;
        }

        if (!searchTerm){
            toast.error('Please provide at least one search term', {
                icon: <span role="img" aria-label="warning">⚠️</span>,
            });
            return;
        }

        setFoundPapers(null)
        setloadingBar(true);

        try {
            const result = await getDocuments({
                variables: {
                    ranking_variable: searchTerm,
                    keywords: keywords
                }
            });

            if (result.data) {
                const metaResult = await getPaperMeta({
                    variables: {
                        paper_list: result.data.documentSearch.response.paper_list,
                        keywords: keywords
                    }
                });

                console.log(metaResult.data.paginatedSearch.response);

                const fetchedPapers = metaResult.data.paginatedSearch.response;
                const convertedPapers = fetchedPapers.map(paper => ({
                    title: paper.Title,
                    authors: paper.Author,
                    year: paper.PublicationDate.Year,
                    collection: "S2AG",
                    idField: "id_int",
                    idType: "int",
                    idValue: paper.id_int.toString()
                }));

                setFoundPapers(convertedPapers);
                setloadingBar(false);
            }
        } catch (error) {
            setloadingBar(false)
            console.error('GraphQL Error:', error);
            toast.error('Failed to retrieve papers. Check console for details.', {
                icon: <span role="img" aria-label="warning">⚠️</span>,
            });
        }
    };


    const handleClickZoteroBtn = async (paper)=> {
        try {
            const result = await addPaperToZotero({
                variables: {
                    zoteroCollectionId: 'Endoc Word Add-In Collection',
                    paper: {
                        collection: paper.collection,
                        id_field: paper.idField,
                        id_type: paper.idType,
                        id_value: paper.idValue,
                    },
                },
            })
            console.log('Zotero response:', result.data.addPaperToZotero)
            toast.success('Paper succesfully added to your Zotero Library.', {
                icon: <span role="img" aria-label="warning">✅️</span>,
            });
        } catch (e) {
            console.error('Zotero Mutation error:', e)
            toast.error('Failed to add paper to Zotero. Check console for details.', {
                icon: <span role="img" aria-label="warning">⚠️</span>,
            });
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


    return (
        <>
            <div className="search-container">
                <p className="title">Discover</p>

                <fieldset className="search-fieldset">
                    <legend className="search-legend">Semantic Search</legend>
                    <input
                        className="input"
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </fieldset>

                <fieldset className="search-fieldset">
                    <legend className="search-legend">Content based filter</legend>
                    <input
                        className="input"
                        type="text"
                        placeholder="Enter keywords..."
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                    />
                </fieldset>

                <button className="search-btn" onClick={handleClickSearchBtn}>
                    Search
                </button>
            </div>

            {loadingBar &&
                <Box sx={{ width: '100%' , mt: "15px"}}>
                    <LinearProgress />
                </Box>
            }

            {foundPapers?.map(paper => (
                <div className="result" key={nanoid()}>
                    <h3>{paper.title}</h3>
                    <p>Authors: {paper.authors.map(author => `${author?.FamilyName}, ${author?.GivenName[0]}. `)}</p>
                    <p>Year: {paper.year}</p>
                    <button onClick={() => handleClickZoteroBtn(paper)}>Add to Zotero</button>
                </div>
            ))}
        </>
    );

};

export default DocumentSearch;