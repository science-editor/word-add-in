import * as React from "react";
import { Box, Typography } from "@mui/material";

export function LibraryScreen() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Library</Typography>
      <Typography variant="body2" color="text.secondary">
        Recently viewed or saved items will appear here in the future.
      </Typography>
    </Box>
  );
}