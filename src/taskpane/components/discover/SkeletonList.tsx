// src/taskpane/components/discover/SkeletonList.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";

export function SkeletonList({ rows = 6 }: { rows?: number }) {
  return (
    <Box sx={{ p: 0, m: 0 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Paper
          key={i}
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            border: (t) => `1px solid ${t.palette.divider}`,
            borderRadius: 1.5,
          }}
        >
          {/* Match SearchResultsPanel: grid with left content + right single icon, vertically centered */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              columnGap: 2,
              alignItems: "center", // center right icon vertically (and left block baseline nicely)
            }}
          >
            {/* Left: title + meta */}
            <Box sx={{ minWidth: 0 }}>
              {/* Title (simulate 1–2 lines) */}
              <Skeleton variant="text" animation="wave" height={22} sx={{ width: "85%" }} />
              <Skeleton variant="text" animation="wave" height={22} sx={{ width: "60%" }} />

              {/* Meta line (single row look with dot-separated feel) */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <Skeleton variant="text" animation="wave" height={16} sx={{ width: "28%" }} />
                <Skeleton variant="text" animation="wave" height={16} sx={{ width: "18%" }} />
                <Skeleton variant="text" animation="wave" height={16} sx={{ width: "10%" }} />
              </Box>
            </Box>

            {/* Right: single action icon placeholder (same size as real button) */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}