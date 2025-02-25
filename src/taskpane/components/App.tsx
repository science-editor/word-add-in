import * as React from "react";
import { useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import { insertText } from "../taskpane";
import { nanoid } from "nanoid";
import { ApolloClient, InMemoryCache, gql, ApolloProvider, useQuery, useLazyQuery } from "@apollo/client";

/*
Open Items:
1. Flow of queries to get documentMeta (documentSearch -> paginatedSearch -> ... ?
1. Implement more parameters of documentSearch Query
 */

interface TitlesProps {
    searchTerm: string;
}


interface Paper {
    title: string;
    authors: any[];
    year: number;
}

const client = new ApolloClient({
    uri: "https://localhost:3001/proxy",
    cache: new InMemoryCache({
        addTypename: false
    }),
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
            ranking_variable: $ranking_variable #semantic search bar
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

const PAGINATED_SEARCH = gql`
    query paginatedSearch($paper_list: [MetadataInput]!, $keywords: [String]) {
        paginatedSearch(paper_list: $paper_list, keywords: $keywords) {
            status
            message
            response {
                _id
                DOI
                Title
                Content {
                    Abstract
                    Abstract_Parsed {
                        section_id
                        section_title
                        section_text {
                            paragraph_id
                            paragraph_text {
                                sentence_id
                                sentence_text
                                sentence_similarity
                                cite_spans {
                                    start
                                    end
                                    text
                                    ref_id
                                }
                            }
                        }
                    }
                }
                Author {
                    FamilyName
                    GivenName
                }
                Venue
                PublicationDate {
                    Year
                    Month
                    Day
                    Name
                }
                id_int
                relevant_sentences
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



const DocumentSearch: React.FC = () => {
    const styles = useStyles();
    const [searchTerm, setSearchTerm] = useState("");
    const [foundPapers, setFoundPapers] = useState<Paper[] | null>(null);
    const [papers] = useState<Paper[]>([]);


    const [getDocuments, { loading: loadingDocs, error: errorDocs, data: dataDocs }] = useLazyQuery(DOCUMENT_SEARCH);
    const [getPaperMeta, { loading: loadingMeta, error: errorMeta, data: dataMeta }] = useLazyQuery(PAGINATED_SEARCH);

    const handleClick = () => {
        getDocuments({
            variables: {
                keywords: searchTerm
            }
        })
            .then(result => {
                if (result.data) {
                    getPaperMeta({
                        variables: {
                            paper_list: result.data.documentSearch.response.paper_list
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

    /*
    if (loadingDocs || loadingMeta) return <p>Loading...</p>;
    if (errorDocs) return <p>ErrorDocs: {errorDocs.message}</p>;
    if (errorMeta) return <p>ErrorMeta: {errorMeta.message}</p>;
    */

    return (
        <>
            <div className={styles.searchContainer}>
                <h3>Discover</h3>
                <p>Search database</p>
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleClick}>Search</button>
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



const App = () => {


    /*
    const handleSearch = () => {
        const results = papers.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
        setFoundPapers(results || null);
    };
     */

    const styles = useStyles();

    return (
        <ApolloProvider client={client}>
            <div className={styles.root}>

                <DocumentSearch
                />
            </div>
        </ApolloProvider>
    );
};

export default App;

