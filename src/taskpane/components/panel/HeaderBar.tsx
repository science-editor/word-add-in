// src/taskpane/components/panel/HeaderBar.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import QuickSearch from "../QuickSearch";

type Props = {
  title?: string;
  /** Updates the semantic search input */
  setSearchTerm: (t: string) => void;
  /** Triggers the actual search */
  onRunSearch: (t: string) => void;
  /** Optional right-side custom content (appears left of QuickSearch) */
  rightExtra?: React.ReactNode;
};

export default function HeaderBar({
  title = "Discover",
  setSearchTerm,
  onRunSearch,
  rightExtra,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        px: 2,
        pt: 1,
        pb: 1,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, m: 0 }}>
        {title}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {rightExtra}
        <QuickSearch setSearchTerm={setSearchTerm} onRunSearch={onRunSearch} />
      </Box>
    </Box>
  );
}