import * as React from "react";
import {
  Drawer,
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AdvancedFilter from "../AdvancedFilter";
import { AdvancedFilterState } from "../../types";

type Props = {
  open: boolean;
  onClose: () => void;
  filters: AdvancedFilterState[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, key: keyof AdvancedFilterState, val: any) => void;
};

export function FiltersDrawer({
  open,
  onClose,
  filters,
  onAdd,
  onRemove,
  onUpdate,
}: Props) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 360,
          maxWidth: "100vw",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
        role="dialog"
        aria-label="Advanced filters"
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1,
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Advanced filters
          </Typography>
          <IconButton
            aria-label="Close"
            size="small"
            onClick={onClose}
            sx={{ width: 32, height: 32 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ p: 2, flex: 1, overflow: "auto", display: "grid", gap: 2 }}>
          {filters.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No filters added yet.
            </Typography>
          ) : (
            filters.map((f) => (
              <AdvancedFilter
                key={f.id}
                id={f.id}
                filterType={f.filterType}
                values={f.values}
                condition={f.condition}
                closeFilter={onRemove}
                updateAdvancedFilter={(
                  id: string,
                  k: keyof AdvancedFilterState,
                  v: any
                ) => onUpdate(id, k, v)}
              />
            ))
          )}
        </Box>

        <Divider />

        {/* Footer */}
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<AddBoxIcon />}
            onClick={onAdd}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Add filter
          </Button>
          <Stack direction="row" spacing={1}>
            <Button
              variant="text"
              onClick={onClose}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Close
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}