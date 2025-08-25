// Libraries
import * as React from "react";
import { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { nanoid } from "nanoid";
import { toast } from 'react-toastify';
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from '@mui/material/LinearProgress';
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from '@mui/icons-material/AddBox';
import SettingsIcon from "@mui/icons-material/Settings";

// Local
import KeywordFilter from "./KeywordFilter";
import AdvancedFilter from "./AdvancedFilter";
import QuickSearch from "./QuickSearch";
import TutorialWindow from "./TutotrialWindow";
import PaperWindow from "./PaperWindow";
import SearchResultsPanel from "./SearchResultsPanel";
import { DOCUMENT_SEARCH, PAGINATED_SEARCH, SINGLE_PAPER_QUERY, ADD_PAPER_TO_ZOTERO } from "../schemas.js";

interface Paper {
    title: string;
    authors: any[];
    year: number;
    venue: string;
    abstract: string;
    fullPaper: string
    collection: string;
    DOI: string;
    id_field: number;
    id_type: number;
    id_value: number
}

const Panel = ({apiKey, handleApiKeyChange}) => {

    // States
    const [showTutorialWindow, setShowTutorialWindow] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [foundPapers, setFoundPapers] = useState<Paper[] | null>(null);
    const [loadingBar, setloadingBar] = useState(false);
    const [expandedPaper, setExpandedPaper] = useState<Paper | null>(null);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [advancedFilters, setAdvancedFilters] = useState(
        [
            {
                id: nanoid(),
                filterType: '',
                values: [],
                condition: 'true',
            }
        ]
    );

    // Apollo hooks for GraphQL queries and mutations
    const [getDocuments, { loading: loadingDocs, error: errorDocs, data: dataDocs }] = useLazyQuery(DOCUMENT_SEARCH);
    const [getPaperMeta, { loading: loadingMeta, error: errorMeta, data: dataMeta }] = useLazyQuery(PAGINATED_SEARCH);
    const [getPaperContent, { loading: loadingContent, error: errorContent, data: dataContent }] = useLazyQuery(SINGLE_PAPER_QUERY);
    const [addPaperToZotero, { loading, error, data }] = useMutation(ADD_PAPER_TO_ZOTERO)


    /* ++++++++++++++++++++++++++++++++++++++++++++++ Tutorial Window +++++++++++++++++++++++++++++++++++++++++++++++ */

    const openTutorialWindow = () => {
        setShowTutorialWindow(true)
    };

    const closeTutorialWindow = () => {
        setShowTutorialWindow(false);
    }


    /* ++++++++++++++++++++++++++++++++++++++++++++++ Paper Retrieval +++++++++++++++++++++++++++++++++++++++++++++++ */

    const handleClickSearchBtn = async (newSearchTerm) => {
        if (!localStorage.getItem("x_api_key")){
            toast.error('Please provide a valid API key first.', {
                icon: <span role="img" aria-label="warning">⚠️</span>,
            });
            return;
        }

        if (!newSearchTerm){
            toast.error('Please provide at least one search term', {
                icon: <span role="img" aria-label="warning">⚠️</span>,
            });
            return;
        }

        setFoundPapers(null)
        setloadingBar(true);

        // Convert keywords and advanced filters into a backend readable format
        const filterObjsAsStrings = convertAdvancedFiltersToStrings()
        const combinedKeywordsAndFilters = filterObjsAsStrings.length > 0 ? [...keywords, ...filterObjsAsStrings] : keywords;
        console.log('--- Keywords and Filters ---')
        console.log(combinedKeywordsAndFilters)
        console.log('--- --- ---')

        try {
            const result = await getDocuments({
                variables: {
                    ranking_variable: newSearchTerm,
                    keywords: combinedKeywordsAndFilters
                }
            });

            if (result.data) {
                const metaResult = await getPaperMeta({
                    variables: {
                        paper_list: result.data.documentSearch.response.paper_list,
                        keywords: combinedKeywordsAndFilters
                    }
                });

                console.log('--- Retrieved Papers ---')
                console.log(metaResult.data.paginatedSearch.response);
                console.log('--- --- ---')

                const fetchedPapers = metaResult.data.paginatedSearch.response;
                const convertedPapers = fetchedPapers.map(paper => ({
                    title: paper.Title,
                    authors: paper.Author,
                    year: paper.PublicationDate.Year,
                    venue: paper.Venue,
                    abstract: null, // Abstract and full paper will be retrieved later when user expands a paper
                    fullPaper: null,
                    collection: paper._id.split("_")[0],
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

    /* ++++++++++++++++++++++++++++++++++++++ Keywords and Filters Management +++++++++++++++++++++++++++++++++++++++ */

    const handleKeywordsChange = (newKeywords: string[]) => {
        setKeywords(newKeywords);
    };

    const addFilter = () => {
        setAdvancedFilters(prev => [
            ...prev,
            {
                id: nanoid(),
                filterType: '',
                values: [],
                condition: 'true',
            }
        ]);
    }

    const closeFilter = (idToRemove) => {
        setAdvancedFilters(prev =>
            prev.filter(filter => filter.id !== idToRemove)
        );
    };

    const updateAdvancedFilter = (selectedID, propertyKey, newValue) => {
        setAdvancedFilters( prev =>
            prev.map(obj =>
                obj.id === selectedID ? { ...obj, [propertyKey]: newValue } : obj
            )
        )
    }

    const convertAdvancedFiltersToStrings = () => {
        const filterObjsAsStrings = []

        for (const filterObj of advancedFilters){
            // Exclude free form filters without any values. Otherwise, these would be submitted to the backend and cause trouble
            if (
                !filterObj.values.length
                &&
                ['publication_year', 'author_full_name', 'author_given_name', 'author_family_name', 'title', 'venue', 'doi'].includes(filterObj.filterType)
            ) {
                continue;
            }

            const conditionStr = filterObj.condition === 'true' ? '' : '!'
            let filterTypeStr = ''
            let valuesStr = ''

            switch (filterObj.filterType){
                case '':
                    continue
                case 'publication_year':
                    filterTypeStr = 'PublicationDate.Year'
                    valuesStr = filterObj.values.length > 0 ? ':' + filterObj.values.join('|') : '';
                    break
                case 'publication_year_range':
                    filterTypeStr = 'PublicationDate.Year'
                    valuesStr = filterObj.values.length > 0 ? ':' + filterObj.values.join('..') : '';
                    break
                case 'author_full_name':
                    filterTypeStr = 'Author.FullName'
                    valuesStr = filterObj.values.length > 0 ? ':' + filterObj.values.join('|') : '';
                    break
                case 'author_given_name':
                    filterTypeStr = 'Author.GivenName'
                    valuesStr = filterObj.values.length > 0 ? ':' + filterObj.values.join('|') : '';
                    break
                case 'author_family_name':
                    filterTypeStr = 'Author.FamilyName'
                    valuesStr = filterObj.values.length > 0 ? ':' + filterObj.values.join('|') : '';
                    break
                case 'title':
                    filterTypeStr = 'Title'
                    valuesStr = filterObj.values.length > 0 ? ':' + filterObj.values.join('|') : '';
                    break
                case 'venue':
                    filterTypeStr = 'Venue'
                    valuesStr = filterObj.values.length > 0 ? ':' + filterObj.values.join('|') : '';
                    break
                case 'doi':
                    filterTypeStr = 'DOI'
                    valuesStr = filterObj.values.length > 0 ? ':' + filterObj.values.join('|') : '';
                    break
                case 'abstract_parsed':
                    filterTypeStr = 'AvailableField:Content.Abstract_Parsed'
                    break
                case 'fullbody_parsed':
                    filterTypeStr = 'AvailableField:Content.Fullbody_Parsed'
            }

            const combinedFilterStr = conditionStr + filterTypeStr + '' + valuesStr
            filterObjsAsStrings.push(combinedFilterStr)
        }

        return filterObjsAsStrings;
    }


    /* +++++++++++++++++++++++++++++++++++++++++++++++++++ Zotero +++++++++++++++++++++++++++++++++++++++++++++++++++ */

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


    /* +++++++++++++++++++++++++++++++++++++++++++++++++ Use Effects ++++++++++++++++++++++++++++++++++++++++++++++++ */

    useEffect(() => {
        // Function to handle storage updates
        const handleStorageChange = () => {
            const newSearchTerm = localStorage.getItem("searchTerm") || "";

            if (newSearchTerm) {
                setSearchTerm(newSearchTerm);
                localStorage.removeItem("searchTerm");
                handleClickSearchBtn(newSearchTerm)
            }
        };

        // Listen for storage events
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);


    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++ JSX ++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    return (
        <>
            <TutorialWindow
                showTutorialWindow={showTutorialWindow}
                closeTutorialWindow={closeTutorialWindow}
                apiKey={apiKey}
                handleApiKeyChange={handleApiKeyChange}
            />

            <div style={{ display: "flex", justifyContent: "space-between"}}>
                <QuickSearch
                    setSearchTerm={setSearchTerm}
                    handleClickSearchBtn={handleClickSearchBtn}
                />
                <IconButton
                    className={apiKey ? '' : 'attention-pulse'}
                    aria-label="Endoc API Key help"
                    size="medium"
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%"
                    }}
                    onClick={openTutorialWindow}
                >
                    <SettingsIcon fontSize="inherit" />
                </IconButton>
            </div>

            <div className="search-container">
                <TextField
                    variant="outlined"
                    label="Semantic Search"
                    placeholder="Semantic discovery - Your text will be used to rank the filtered papers"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    fullWidth
                />

                <KeywordFilter
                    selectedKeywords={keywords}
                    onKeywordsChange={handleKeywordsChange}
                />


                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {advancedFilters.length === 0 ? (
                        // If there are no filters being rendered, just render the "Add Filter" button
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box sx={{ flex: 1 }} />
                            <Tooltip title="Add Filter">
                                <IconButton
                                    aria-label="Add Filter"
                                    size="medium"
                                    onClick={addFilter}
                                    sx={{
                                        flexShrink: 0,
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%",
                                        p: 0,
                                    }}
                                >
                                    <AddBoxIcon fontSize="inherit" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    ) : (
                        <>
                            {/* All but the last filter will have full width */}
                            {advancedFilters.slice(0, -1).map((obj) => (
                                <AdvancedFilter
                                    key={obj.id}
                                    id={obj.id}
                                    filterType={obj.filterType}
                                    values={obj.values}
                                    condition={obj.condition}
                                    closeFilter={closeFilter}
                                    updateAdvancedFilter={updateAdvancedFilter}
                                />
                            ))}

                            {/* Last filter will be in a flex row with the "Add filter" button on its right */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box sx={{ flex: 1 }}>
                                    <AdvancedFilter
                                        key={advancedFilters[advancedFilters.length - 1].id}
                                        id={advancedFilters[advancedFilters.length - 1].id}
                                        filterType={advancedFilters[advancedFilters.length - 1].filterType}
                                        values={advancedFilters[advancedFilters.length - 1].values}
                                        condition={advancedFilters[advancedFilters.length - 1].condition}
                                        closeFilter={closeFilter}
                                        updateAdvancedFilter={updateAdvancedFilter}
                                    />
                                </Box>

                                <Tooltip title="Add Filter">
                                    <IconButton
                                        aria-label="Add Filter"
                                        size="medium"
                                        onClick={addFilter}
                                        sx={{
                                            flexShrink: 0,
                                            width: 32,
                                            height: 32,
                                            borderRadius: "50%",
                                            p: 0,
                                        }}
                                    >
                                        <AddBoxIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </>
                    )}
                </Box>

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
                            onClick={() => handleClickSearchBtn(searchTerm)}
                            disabled={!apiKey.trim()}
                        >
                            Search
                        </button>
                    </Tooltip>
                ) : (
                    <button
                        className="search-btn"
                        onClick={() => handleClickSearchBtn(searchTerm)}
                        disabled={!apiKey.trim() || loadingBar}
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

            <SearchResultsPanel
                foundPapers={foundPapers}
                handleClickReadPaper={handleClickReadPaper}
                handleClickZoteroBtn={handleClickZoteroBtn}
            />

            <PaperWindow
                expandedPaper={expandedPaper}
                setExpandedPaper={setExpandedPaper}
                handleClickZoteroBtn={handleClickZoteroBtn}
            />
        </>
    );

};

export default Panel;