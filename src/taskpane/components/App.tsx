import * as React from "react";
import { useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import { insertText } from "../taskpane";
import { nanoid } from "nanoid";
import { ApolloClient, InMemoryCache, gql, ApolloProvider, useQuery, useLazyQuery } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://localhost:3001/proxy",
    cache: new InMemoryCache(),
});

/*
const TITLE_SEARCH = gql`
    query TitleSearch($titles: [String]!) {
        titleSearch(titles: $titles) {
            status
            message
            results {
                title
                author
                year
            }
        }
    }
`;
 */

const TITLE_SEARCH = gql`
    query {
        titleSearch(titles: ["Quantum Mechanics", "Machine Learning"]) {
            status
            message
            response {
                Title
            }
        }
    }
`;


interface Paper {
    title: string;
    authors: string[];
    year: number;
}

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


const Titles: React.FC = () => {
    const [getTitles, { loading, error, data }] = useLazyQuery(TITLE_SEARCH);

    const handleClick = () => {
        getTitles()
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
                    {JSON.stringify(data)}
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

    const getTitlesFetchAPI = async () => {
        const response = await fetch("https://localhost:3001/proxy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: `query {
                titleSearch(titles: ["Quantum Mechanics", "Machine Learning"]) {
                    status
                    message
                    response {
                        Title
                    }
                }
            }`
            })
        });

        const data = await response.json(); // Parse JSON response
        console.log(data); // Return the parsed data
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
                <Titles />
                <button onClick={getTitlesFetchAPI}>Get Titles (Fetch API)</button>

            </div>
        </ApolloProvider>
    );
};

export default App;

