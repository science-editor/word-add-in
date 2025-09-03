import * as React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export function SkeletonList({ rows = 6 }: { rows?: number }) {
  return (
    <Box sx={{ px: 2, py: 1 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Box key={i} sx={{ mb: 2 }}>
          {/* Title line */}
          <Skeleton variant="text" animation="wave" height={22} sx={{ width: "80%" }} />
          {/* Meta line */}
          <Skeleton variant="text" animation="wave" height={16} sx={{ width: "60%" }} />
          {/* Abstract snippet */}
          <Skeleton variant="rectangular" animation="wave" height={56} sx={{ mt: 1, borderRadius: 1 }} />
        </Box>
      ))}
    </Box>
  );
}