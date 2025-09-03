// src/taskpane/components/discover/SkeletonList.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export function SkeletonList({ rows = 6 }: { rows?: number }) {
  return (
    <Box sx={{ px: 0, py: 1, display: "grid", gap: 2 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Box
          key={i}
          sx={{
            p: 2,
            border: (t) => `1px solid ${t.palette.divider}`,
            borderRadius: 1,
            bgcolor: "background.paper",
            boxShadow: 0,
          }}
        >
          <Skeleton animation="wave" height={22} sx={{ width: "80%", mb: 0.5 }} />
          <Skeleton animation="wave" height={16} sx={{ width: "60%", mb: 1.5 }} />
          <Skeleton animation="wave" variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
        </Box>
      ))}
    </Box>
  );
}