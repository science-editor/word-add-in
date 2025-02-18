import * as React from "react";
import { useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import { insertText } from "../taskpane";
import { nanoid } from "nanoid";
import { ApolloClient, InMemoryCache, gql, ApolloProvider, useQuery, useLazyQuery } from "@apollo/client";

/*
Open Items:
1. Meaning of DocumentSearch query variables
2. Flow of queries to get documentMeta (documentSearch -> paginatedSearch -> ... ?)
 */

interface TitlesProps {
    searchTerm: string;
}

interface DocumentSearchProps {
    searchTerm: string;
}

interface Paper {
    title: string;
    authors: string[];
    year: number;
}

const client = new ApolloClient({
    uri: "https://localhost:3001/proxy",
    cache: new InMemoryCache(),
});


const TITLE_SEARCH = gql`
    query TitleSearch($titles: [String]!) {
        titleSearch(titles: $titles) {
            status
            message
            response {
                Title
            }
        }
    }
`;

const DOCUMENT_SEARCH = gql`
    query documentSearch($ranking_variable: String, $keywords: [String], $paper_list: [MetadataInput], $ranking_collection: String, $ranking_id_field: String, $ranking_id_value: String, $ranking_id_type: String) {
        documentSearch(
            ranking_variable: $ranking_variable
            keywords: $keywords
            paper_list: $paper_list
            ranking_collection: $ranking_collection
            ranking_id_field: $ranking_id_field
            ranking_id_value: $ranking_id_value
            ranking_id_type: $ranking_id_type
        ) {
            status
            message
            response {
                search_stats {
                    DurationTotalSearch
                    nMatchingDocuments
                }
                paper_list {
                    collection
                    id_field
                    id_type
                    id_value
                }
                reranking_scores
                prefetching_scores
            }
        }
    }
`;


const useStyles = makeStyles({
    root: {
        minHeight: "100vh",
        padding: "20px",
    },
    searchContainer: {
        marginBottom: "20px",
    },
    result: {
        marginTop: "20px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
    },
});


const Titles: React.FC<TitlesProps> = ({ searchTerm }) => {
    const [getTitles, { loading, error, data }] = useLazyQuery(TITLE_SEARCH);

    const handleClick = () => {
        getTitles({
            variables: {
                titles: [searchTerm] // Use searchTerm in the query variables
            }
        })
            .then(result => console.log('GraphQL Response:', result))
            .catch(error => console.error('GraphQL Error:', error));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <button onClick={handleClick}>
                Get Titles (GraphQL)
            </button>
            {data && (
                <div>
                    <div>Search Term: {searchTerm}</div>
                    <div>
                        {JSON.stringify(data)}
                    </div>
                </div>
            )}
        </div>
    );
};


const DocumentSearch: React.FC<DocumentSearchProps> = ({ searchTerm }) => {
    const [getDocuments, {loading, error, data}] = useLazyQuery(DOCUMENT_SEARCH);

    const handleClick = () => {
        getDocuments({
            variables: {
                keywords: searchTerm
            }
        })
            .then(result => console.log('GraphQL Response:', result))
            .catch(error => console.error('GraphQL Error:', error));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <button onClick={handleClick}>
                Search Document (GraphQL)
            </button>
            {data && (
                <div>
                    <div>Search Term: {searchTerm}</div>
                    <div>
                        {JSON.stringify(data)}
                    </div>
                </div>
            )}
        </div>
    );
};


const App = () => {
    const styles = useStyles();
    const [searchTerm, setSearchTerm] = useState("");
    const [foundPapers, setFoundPapers] = useState<Paper[] | null>(null);
    const [papers] = useState<Paper[]>([
        {
            title: "Efficient algorithm for initializing amplitude distribution of a quantum register",
            authors: ["M. Andrecut", "M. K. Ali"],
            year: 2001,
        },
        {
            title: "Variational Quantum Simulation of Lindblad Dynamics via Quantum State Diffusion.",
            authors: ["Jianming Luo", "Kaihan Lin", "Xing Gao"],
            year: 2024,
        },
        {
            title: "Jumptime unraveling of Markovian open quantum systems",
            authors: ["C. Gneiting", "A. Rozhkov", "F. Nori"],
            year: 2020,
        },
    ]);

    const handleSearch = () => {
        const results = papers.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
        setFoundPapers(results || null);
    };



    return (
        <ApolloProvider client={client}>
            <div className={styles.root}>
                <div className={styles.searchContainer}>
                    <h3>Discover</h3>
                    <p>Search database</p>
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>

                {foundPapers?.map(paper => (
                    <div className={styles.result} key={nanoid()}>
                        <h3>{paper.title}</h3>
                        <p>Authors: {`${paper.authors.join(", ")} • ${paper.year}`}</p>
                        <button onClick={() => insertText(paper)}>Insert</button>
                    </div>
                ))}
                <Titles
                    searchTerm={searchTerm}
                />
                <DocumentSearch
                    searchTerm={searchTerm}
                />
            </div>
        </ApolloProvider>
    );
};

export default App;

