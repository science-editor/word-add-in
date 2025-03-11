import * as React from "react";
import { useState, useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { nanoid } from "nanoid";
import { insertText } from "../taskpane";
import { makeStyles } from "@fluentui/react-components";
import { DOCUMENT_SEARCH, PAGINATED_SEARCH} from '../schemas.js';

const useStyles = makeStyles({
    searchContainer: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "20px",
    },
    result: {
        marginTop: "20px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
    },
    fieldset: {
        border: "2px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        transition: "border-color 0.3s ease",
    },
    legend: {
        color: "#333",
        fontSize: "14px",
        fontWeight: "bold",
    },
    input: {
        border: "none",
        outline: "none", // Remove default focus outline on input
        fontSize: "16px",
        padding: "5px",
    },
    searchBtn: {
        background: "linear-gradient(135deg, #007bff, #0056b3)", // Gradient blue
        color: "#fff", // White text
        padding: "10px 20px",
        fontSize: "16px",
        fontWeight: "bold",
        border: "none",
        borderRadius: "25px", // Rounded edges
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)", // Soft shadow

        "&:hover": {
            background: "linear-gradient(135deg, #0056b3, #003f7f)", // Darker on hover
            boxShadow: "0 6px 15px rgba(0, 86, 179, 0.5)", // Enhanced shadow
            transform: "scale(1.05)", // Slight pop effect
        },

        "&:active": {
            transform: "scale(0.98)", // Slight press effect
            boxShadow: "0 2px 5px rgba(0, 86, 179, 0.5)",
        },
    }
});


interface Paper {
    title: string;
    authors: any[];
    year: number;
}

//type Keyword = string;

const DocumentSearch = () => {
    const styles = useStyles();
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

                // ✅ Remove the stored value **after** updating state
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
            <div className={styles.searchContainer}>
                <h3>Discover</h3>

                <div className={styles.searchContainer}>
                    <h3>Enter Zotero Credentials</h3>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Enter your API key..."
                        value={apiKey}
                        onChange={handleApiKeyChange} // Saves to localStorage immediately
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Enter your User ID..."
                        value={userId}
                        onChange={handleUserIdChange} // Saves to localStorage immediately
                    />
                    <p>Stored API Key: {apiKey ? apiKey : "Not set"}</p>
                    <p>Stored User ID: {userId ? userId : "Not set"}</p>
                </div>

                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Semantic Search</legend>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </fieldset>
                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Content based filter</legend>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Enter keywords..."
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                    />
                </fieldset>
                <button className={styles.searchBtn} onClick={handleClickSearchBtn}>Search</button>
            </div>

            {foundPapers?.map(paper => (
                <div className={styles.result} key={nanoid()}>
                    <h3>{paper.title}</h3>
                    <p>Authors: {paper.authors.map( author => `${author?.FamilyName}, ${author?.GivenName[0]}. `)}</p>
                    <p>Year: {paper.year}</p>
                    <button onClick={() => insertText(paper)}>Insert</button>
                    <button onClick={addToZotero}>Add to Zotero</button>
                </div>
            ))}
        </>
    );
};

export default DocumentSearch;