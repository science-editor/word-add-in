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
          {/* Match SearchResultsPanel layout: left content + right icon column */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr auto", sm: "1fr auto" },
              columnGap: 2,
              rowGap: 1,
              alignItems: "start",
            }}
          >
            {/* Left: title, meta, snippet */}
            <Box sx={{ minWidth: 0 }}>
              {/* Title (allow 1–2 lines of varying width for realism) */}
              <Skeleton variant="text" animation="wave" height={22} sx={{ width: "85%" }} />
              <Skeleton variant="text" animation="wave" height={22} sx={{ width: "60%" }} />

              {/* Meta line (single row look) */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <Skeleton variant="text" animation="wave" height={16} sx={{ width: "28%" }} />
                <Skeleton variant="text" animation="wave" height={16} sx={{ width: "18%" }} />
                <Skeleton variant="text" animation="wave" height={16} sx={{ width: "10%" }} />
              </Box>

              {/* Abstract / snippet block */}
              <Skeleton
                variant="rectangular"
                animation="wave"
                height={56}
                sx={{ mt: 1, borderRadius: 1 }}
              />
            </Box>

            {/* Right: action buttons column (same size/positions as real icons) */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: "flex-end",
                justifySelf: "end",
              }}
            >
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}