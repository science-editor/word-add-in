import * as React from "react";
import { nanoid } from "nanoid";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MenuBookIcon from "@mui/icons-material/MenuBook";

function SearchResultsPanel( {foundPapers, handleClickReadPaper, handleClickZoteroBtn}){
    return (
        <>
            {foundPapers?.map(paper => {
                const titleTooLong = paper.title.length > 100;
                const truncatedTitle = titleTooLong
                    ? `${paper.title.substring(0, 100)}…`
                    : paper.title;

                return (
                    <div className='paper-box' key={nanoid()}>
                        <div>
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
                                {paper.authors.map(
                                    (author) => `${author?.FamilyName}, ${author?.GivenName[0]}. `
                                )}
                            </p>
                            <p>{paper.venue}</p>
                            <p>{paper.year}</p>
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
    )
}

export default SearchResultsPanel;