import * as React from "react";
import { Box, Button } from "@mui/material";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

export function FiltersLauncher({
  count,
  onOpen,
}: {
  count: number;
  onOpen: () => void;
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        onClick={onOpen}
        size="medium"
        color="primary"
        startIcon={<FilterListOutlinedIcon />}
        sx={{
          minHeight: 48,             // match inputs
          px: 0.5,
          textTransform: "none",
          fontWeight: 600,
          color: "primary.main",
          backgroundColor: "transparent",
          boxShadow: "none",
          "&:hover": { backgroundColor: "transparent" },
          "& .MuiButton-startIcon": { mr: 0.75 },
        }}
      >
        Advanced Filters {count > 0 ? `(${count})` : ""}
      </Button>
    </Box>
  );
}