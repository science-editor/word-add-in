import * as React from "react";
import { Box, Stack, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AdvancedFilter from "../AdvancedFilter";
import { AdvancedFilterState } from "../../types";

/** Keep spacing consistent with Discover */
const PAD = 2;                 // grid gap + outer padding rhythm
const CONTROL_MIN_HEIGHT = 48; // unify perceived control height
const FOOTER_BAR_HEIGHT = 56;  // sticky footer visual height

export function FiltersInline({
  filters,
  onAdd,
  onRemove,
  onUpdate,
  onDone,
}: {
  filters: AdvancedFilterState[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, key: keyof AdvancedFilterState, val: any) => void;
  onDone: () => void;
}) {
  return (
    <Box
      sx={{
        // Let this block grow in its parent; if the parent doesn’t constrain height,
        // the sticky footer still pins to the bottom of the viewport.
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      {/* Scrollable list of filters */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          pr: 0.5,
          // Add bottom padding so the last filter isn't obscured by sticky footer
          pb: `${FOOTER_BAR_HEIGHT + 8}px`,
        }}
      >
        {filters.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: PAD }}>
            No filters yet.
          </Typography>
        ) : (
          <Stack spacing={PAD} sx={{ mt: PAD }}>
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
      </Box>

      {/* Sticky footer action bar — ALWAYS visible */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 1,
          height: FOOTER_BAR_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          px: 1,
          borderTop: (t) => `1px solid ${t.palette.divider}`,
          backgroundColor: (t) => t.palette.background.paper,
        }}
      >
        <Button
          onClick={onAdd}
          startIcon={<AddIcon />}
          sx={{
            minHeight: CONTROL_MIN_HEIGHT,
            textTransform: "none",
            fontWeight: 600,
            px: 1,
            color: "primary.main",
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          Add filter
        </Button>

        <Button
          variant="contained"
          onClick={onDone}
          sx={{ minHeight: CONTROL_MIN_HEIGHT, textTransform: "none", fontWeight: 600 }}
        >
          Done
        </Button>
      </Box>
    </Box>
  );
}

export default FiltersInline;