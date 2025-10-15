import * as React from "react";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AdvancedFilter from "../AdvancedFilter";
import { AdvancedFilterState } from "../../types";

export function FiltersSection({
  filters,
  onAdd,
  onClose,
  onUpdate,
}: {
  filters: AdvancedFilterState[];
  onAdd: () => void;
  onClose: (id: string) => void;
  onUpdate: (id: string, key: keyof AdvancedFilterState, val: any) => void;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {filters.length === 0 ? (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ flex: 1 }} />
          <Tooltip title="Add Filter">
            <IconButton
              aria-label="Add Filter"
              size="medium"
              onClick={onAdd}
              sx={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", p: 0 }}
            >
              <AddBoxIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>
      ) : (
        <>
          {filters.slice(0, -1).map((f) => (
            <AdvancedFilter
              key={f.id}
              id={f.id}
              filterType={f.filterType}
              values={f.values}
              condition={f.condition}
              closeFilter={onClose}
              updateAdvancedFilter={(id, k, v) => onUpdate(id, k as keyof AdvancedFilterState, v)}
            />
          ))}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <AdvancedFilter
                key={filters[filters.length - 1].id}
                id={filters[filters.length - 1].id}
                filterType={filters[filters.length - 1].filterType}
                values={filters[filters.length - 1].values}
                condition={filters[filters.length - 1].condition}
                closeFilter={onClose}
                updateAdvancedFilter={(id, k, v) => onUpdate(id, k as keyof AdvancedFilterState, v)}
              />
            </Box>

            <Tooltip title="Add Filter">
              <IconButton
                aria-label="Add Filter"
                size="medium"
                onClick={onAdd}
                sx={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", p: 0 }}
              >
                <AddBoxIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}
    </Box>
  );
}