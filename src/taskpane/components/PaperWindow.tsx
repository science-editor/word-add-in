// Libraries
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

// Local
import DOIChip from "./DOIChip";
import GoogleScholarChip from "./GoogleScholarChip";

function PaperWindow( {expandedPaper, setExpandedPaper, handleClickZoteroBtn } ) {

    return (
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
                <p>Venue: {expandedPaper?.venue}</p>
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
    )

}

export default PaperWindow;