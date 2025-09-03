// src/taskpane/components/discover/FiltersDrawer.tsx
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseIcon from "@mui/icons-material/Close";
import AdvancedFilter from "../AdvancedFilter";
import { AdvancedFilterState } from "../../types";

export function FiltersDrawer({
  open,
  onClose,
  filters,
  onAdd,
  onRemove,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  filters: AdvancedFilterState[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, key: keyof AdvancedFilterState, val: any) => void;
}) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 360, p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Advanced filters
          </Typography>
          <IconButton aria-label="Close" size="small" onClick={onClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>

        <Stack spacing={1.5}>
          {filters.map((f) => (
            <AdvancedFilter
              key={f.id}
              id={f.id}
              filterType={f.filterType}
              values={f.values}
              condition={f.condition}
              closeFilter={onRemove}
              updateAdvancedFilter={onUpdate}
            />
          ))}
        </Stack>

        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button
            onClick={onAdd}
            startIcon={<AddBoxIcon />}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", height: 40 }}
          >
            Add filter
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={onClose} variant="contained" size="small" sx={{ textTransform: "none", height: 40 }}>
            Done
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

export function FiltersLauncher({
  count,
  onOpen,
}: {
  count: number;
  onOpen: () => void;
}) {
  return (
    <Button
      onClick={onOpen}
      variant="outlined"
      size="small"
      sx={{
        justifyContent: "flex-start",
        height: 40,                            // ← same height
        textTransform: "none",
        position: "relative",
      }}
    >
      Advanced filters
      {count > 0 && (
        <Box
          component="span"
          sx={{
            ml: 1.25,
            fontSize: 12,
            lineHeight: "18px",
            borderRadius: "10px",
            px: 1,
            backgroundColor: "action.selected",
            color: "text.primary",
          }}
        >
          {count}
        </Box>
      )}
    </Button>
  );
}