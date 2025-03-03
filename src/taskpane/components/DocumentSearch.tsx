import * as React from "react";
import { useState } from "react";
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

    return (
        <>
            <div className={styles.searchContainer}>
                <h3>Discover</h3>
                <p>Search database</p>
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
                </div>
            ))}
        </>
    );
};

export default DocumentSearch;