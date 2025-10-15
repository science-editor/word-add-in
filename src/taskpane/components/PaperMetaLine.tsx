// Libraries
import * as React from "react";
import Typography from "@mui/material/Typography";
import type { Paper } from "../types";

/**
 * Renders authors • venue • year as a SINGLE LINE with ellipsis when needed.
 */
export default function PaperMetaLine({ paper }: { paper: Paper }) {
  const authorText =
    paper.authors?.length
      ? `${paper.authors
          .slice(0, 2)
          .map((a) => `${a?.FamilyName}, ${a?.GivenName?.[0]}.`)
          .join(" ")}${paper.authors.length > 2 ? " et al." : ""}`
      : undefined;

  const pieces = [
    authorText,
    paper.venue ? String(paper.venue) : undefined,
    paper.year ? String(paper.year) : undefined,
  ].filter(Boolean) as string[];

  const line = pieces.join(" • ");

  return (
    <Typography
      variant="body2"
      color="text.secondary"
      noWrap
      title={line} // full text on hover
      sx={{
        mt: 0.5,
        display: "block",
        maxWidth: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {line}
    </Typography>
  );
}