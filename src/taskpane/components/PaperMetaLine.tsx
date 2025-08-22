// Libraries
import React from "react";
import { Box } from "@mui/material";

function PaperMetaLine({ paper }) {
    const authorText =
        paper.authors?.length
            ? paper.authors
                .slice(0, 2)
                .map(a => `${a?.FamilyName}, ${a?.GivenName?.[0]}.`)
                .join(" ") +
            (paper.authors.length > 2 ? " et al." : "")
            : null;

    // Keep only truthy items
    const metaData = [
        authorText && <span key="authors">{authorText}</span>,
        paper.venue && <span key="venue">{paper.venue}</span>,
        paper.year && <span key="year">{paper.year}</span>,
    ].filter(Boolean);

    // Insert dots only between items
    const completeMetaDataString = metaData.reduce((acc, el, i) => {
        if (i === 0) return [el];
        return [...acc, <span key={`dot-${i}`}>•</span>, el];
    }, []);

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {completeMetaDataString}
        </Box>
    );
}

export default PaperMetaLine;
