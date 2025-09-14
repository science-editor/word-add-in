import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

import AdvancedFilter from "../AdvancedFilter";
import { AdvancedFilterState } from "../../types";

export function FiltersModal({
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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      PaperProps={{
        elevation: 0,
        sx: {
          border: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 1.5,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Advanced Filters</DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {filters.length === 0 ? (
          <Box
            sx={{
              minHeight: 140,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 1,
              color: "text.secondary",
            }}
          >
            <Typography variant="body1" fontWeight={500}>
              No filters added yet
            </Typography>
            <Typography variant="body2" sx={{ maxWidth: 280 }}>
              Use filters to narrow down your search results. You can add multiple filters and combine them for precise control.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {filters.map((f) => (
              <AdvancedFilter
                key={f.id}
                id={f.id}
                filterType={f.filterType}
                values={f.values}
                condition={f.condition}
                closeFilter={onRemove}
                updateAdvancedFilter={(id, k, v) =>
                  onUpdate(id, k as keyof AdvancedFilterState, v)
                }
              />
            ))}
          </Stack>
        )}
      </DialogContent>

      {/* Bottom action row: Add filter (left) + Done (right) */}
      <DialogActions
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        
        <Button
          variant="outlined"
          startIcon={<AddBoxIcon />}
          onClick={onAdd}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderColor: "primary.main",
            color: "primary.main",
          }}
        >
          Add filter
        </Button>

        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FiltersModal;