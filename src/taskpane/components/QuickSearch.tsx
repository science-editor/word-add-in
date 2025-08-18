import React from "react";
import { Button } from "@mui/material";
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import Typography from "@mui/material/Typography";

 function QuickSearch( { setSearchTerm, handleClickSearchBtn }) {
    const getDocumentText = async () => {
        try {
            await Word.run(async (context) => {
                const body = context.document.body;
                body.load("text");
                await context.sync();
                if (body.text) {
                    setSearchTerm(body.text);
                    handleClickSearchBtn(body.text)
                }
            });
        } catch (error) {
            console.error("Error reading document:", error);
        }
    };

    return (
        <Button
            variant="outlined"
            startIcon={
                <DocumentScannerOutlinedIcon
                    sx={{
                        fontSize: 'medium !important',
                        display: 'inline-flex',
                        color: 'text.primary',
                    }}
                />
            }
            sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                height: '24px',
                minHeight: '24px',
                px: 1,
                color: "text.primary",
                borderColor: "text.primary",
            }}
            onClick={getDocumentText}
        >
            <Typography
                variant="inherit"
                sx={{
                    fontSize: '10px',
                    lineHeight: '24px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: "text.primary"
                }}
            >
                Quick search
            </Typography>
        </Button>
    );
}

export default QuickSearch;
