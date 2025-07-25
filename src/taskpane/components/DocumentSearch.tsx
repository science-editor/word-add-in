import * as React from "react";
import { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { nanoid } from "nanoid";
import { DOCUMENT_SEARCH, PAGINATED_SEARCH, SINGLE_PAPER_QUERY, ADD_PAPER_TO_ZOTERO } from "../schemas.js";
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from "@mui/material/Tooltip";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import IconButton from "@mui/material/IconButton";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import GoogleScholarChip from "./GoogleScholarChip";
import DOIChip from "./DOIChip";
import KeywordFilter from "./KeywordFilter";

interface Paper {
    title: string;
    authors: any[];
    year: number;
    abstract: string;
    fullPaper: string
    collection: string;
    DOI: string;
    id_field: number;
    id_type: number;
    id_value: number
}

const DocumentSearch = ({apiKey}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [foundPapers, setFoundPapers] = useState<Paper[] | null>(null);
    const [loadingBar, setloadingBar] = useState(false);
    const [expandedPaper, setExpandedPaper] = useState<Paper | null>(null);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [getDocuments, { loading: loadingDocs, error: errorDocs, data: dataDocs }] = useLazyQuery(DOCUMENT_SEARCH);
    const [getPaperMeta, { loading: loadingMeta, error: errorMeta, data: dataMeta }] = useLazyQuery(PAGINATED_SEARCH);
    const [getPaperContent, { loading: loadingContent, error: errorContent, data: dataContent }] = useLazyQuery(SINGLE_PAPER_QUERY);
    const [addPaperToZotero, { loading, error, data }] = useMutation(ADD_PAPER_TO_ZOTERO)

    const handleKeywordsChange = (newKeywords: string[]) => {
        setKeywords(newKeywords);
    };

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
                    abstract: null, //SINGLE_PAPER_QUERY
                    fullPaper: null, //SINGLE_PAPER_QUERY
                    collection: "S2AG",
                    DOI: paper.DOI,
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
            console.log('Zotero responseEE:', result.data.addPaperToZotero)
            if (result.data.addPaperToZotero.status === 'success'){
                toast.success('Paper succesfully added to your Zotero Library.', {
                    icon: <span role="img" aria-label="warning">✅️</span>,
                });
            } else {
                toast.error('Paper could not be added because your Zotero Account ist not connected to your Endoc Account.', {
                    icon: <span role="img" aria-label="warning">⚠️</span>,
                });
            }

        } catch (e) {
            console.error('Zotero Mutation error:', e)
            toast.error('Failed to add paper to Zotero. Check console for details.', {
                icon: <span role="img" aria-label="warning">⚠️</span>,
            });
        }
    }

    const handleClickReadPaper = async (paper) => {
        try {
            const contentResult = await getPaperContent({
                variables: {
                    paper_id: {
                        collection: paper.collection,
                        id_field: paper.idField,
                        id_type: paper.idType,
                        id_value: paper.idValue,
                    }
                }
            });

            const paperContent = contentResult.data.singlePaper.response.Content

            const abstract = paperContent.Abstract;
            const fullPaper = paperContent.Fullbody;

            const paperWithContent = {
                ...paper,
                abstract,
                fullPaper
            };

            setExpandedPaper(paperWithContent);
        } catch (error) {
            console.error('Error loading paper content:', error);
            toast.error('Failed to load paper content. Please try again later or check console for details.', {
                icon: <span role="img" aria-label="warning">⚠️</span>,
            });
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
            <Dialog
                open={Boolean(expandedPaper)}
                onClose={() => setExpandedPaper(null)}
                fullWidth
                maxWidth="md"
                scroll="body"
            >
                <DialogActions>
                    <IconButton
                        aria-label="Read paper"
                        size="medium"
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%"
                        }}
                        onClick={() => handleClickZoteroBtn(expandedPaper)}
                    >
                        <img
                            src='https://raw.githubusercontent.com/science-editor/word-add-in/refs/heads/main/assets/zotero-icon.ico'
                            alt="Add to Zotero"
                            width={20}
                            height={20}
                        />
                    </IconButton>
                    <IconButton
                        aria-label="Read paper"
                        size="medium"
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%"
                        }}
                        onClick={() => setExpandedPaper(null)}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                </DialogActions>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {expandedPaper?.title}
                </DialogTitle>
                <DialogContent>
                    <p>
                        Authors:{' '}
                        {expandedPaper?.authors.map(
                            (author) => `${author?.FamilyName}, ${author?.GivenName[0]}. `
                        )}
                    </p>
                    <p>Year: {expandedPaper?.year}</p>
                    <DOIChip
                        paper={expandedPaper}
                    />
                    <GoogleScholarChip
                        paper={expandedPaper}
                    />
                </DialogContent>
                <DialogContent dividers>
                    <p>{expandedPaper?.abstract ? expandedPaper.abstract : 'Abstract not available for this paper.'} </p>
                </DialogContent>
                <DialogContent dividers>
                    <p>{expandedPaper?.fullPaper ? expandedPaper.fullPaper : 'Fully body not available for this paper.'} </p>
                </DialogContent>
            </Dialog>

            <div className="search-container">
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

                <KeywordFilter
                    selectedKeywords={keywords}
                    onKeywordsChange={handleKeywordsChange}
                />

                {!apiKey.trim() ? (
                    <Tooltip
                        title={'Add a valid Endoc API Key in the settings section before performing searches.'}
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    fontSize: '1.2rem',
                                    lineHeight: 1.4,
                                }
                            }
                        }}
                    >
                        <button
                            className="search-btn"
                            onClick={handleClickSearchBtn}
                            disabled={!apiKey.trim()}
                        >
                            Search
                        </button>
                    </Tooltip>
                ) : (
                    <button
                        className="search-btn"
                        onClick={handleClickSearchBtn}
                        disabled={!apiKey.trim()}
                    >
                        Search
                    </button>
                )}
            </div>

            {loadingBar &&
                <Box sx={{ width: '100%' , mt: "15px"}}>
                    <LinearProgress />
                </Box>
            }

            {foundPapers?.map(paper => {
                const titleTooLong = paper.title.length > 100;
                const truncatedTitle = titleTooLong
                    ? `${paper.title.substring(0, 100)}…`
                    : paper.title;

                return (
                    <div className='paper-box' key={nanoid()}>
                        <div className='paper-box-meta-container'>
                            {titleTooLong ? (
                                <Tooltip
                                    title={paper.title}
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                fontSize: '1.2rem',
                                                lineHeight: 1.4,
                                            }
                                        }
                                    }}
                                >
                                    <h3>{truncatedTitle}</h3>
                                </Tooltip>
                            ) : (
                                <h3>{truncatedTitle}</h3>
                            )}

                            <p>
                                Authors:{' '}
                                {paper.authors.map(
                                    (author) => `${author?.FamilyName}, ${author?.GivenName[0]}. `
                                )}
                            </p>
                            <p>Year: {paper.year}</p>
                        </div>

                        <div className='paper-box-buttons-container'>
                            <Tooltip
                                title={"Expand this paper."}
                            >
                                <IconButton
                                    aria-label="Read paper"
                                    size="medium"
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => handleClickReadPaper(paper)}
                                >
                                    <MenuBookIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip
                                title={"Add this paper to Zotero."}
                            >
                                <IconButton
                                    aria-label="Read paper"
                                    size="medium"
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => handleClickZoteroBtn(paper)}
                                >
                                    <img
                                        src='https://raw.githubusercontent.com/science-editor/word-add-in/refs/heads/main/assets/zotero-icon.ico'
                                        alt="Add to Zotero"
                                        width={20}
                                        height={20}
                                    />
                                </IconButton>
                            </Tooltip>
                        </div>

                    </div>
                );
            })}
        </>
    );

};

export default DocumentSearch;