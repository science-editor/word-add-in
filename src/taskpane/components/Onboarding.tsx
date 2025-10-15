// Libraries
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";

/**
 * First-run onboarding screen shown inside the taskpane.
 * - Uses relative font sizes (rem/clamp) so it matches Word’s typography
 * - Compact spacing to avoid oversized feel
 */
export default function Onboarding({
  onGetStarted,
}: {
  onGetStarted: () => void;
}) {
  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 480,
          px: 2,
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <img
            src="assets/endoc-logo-160.png"
            alt="Endoc"
            width={64}
            height={64}
            style={{ imageRendering: "auto" }}
          />
        </Box>

        {/* Title & subtitle */}
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 0.5, fontSize: "1.25rem" }}
        >
          Endoc
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", mb: 3, fontSize: "0.9rem" }}
        >
          Discover the scientific literature with a little help from AI.
        </Typography>

        {/* Bullets */}
        <Stack spacing={1.5} sx={{ textAlign: "left", mb: 4 }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <LibraryBooksOutlinedIcon
              fontSize="small"
              sx={{ mt: "2px", color: "text.secondary" }}
            />
            <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
              Keep up with the literature and manage your{" "}
              <strong>Zotero Library</strong>
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <FormatQuoteOutlinedIcon
              fontSize="small"
              sx={{ mt: "2px", color: "text.secondary" }}
            />
            <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
              Get <strong>citation recommendations</strong> as you write
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <CheckCircleOutlineIcon
              fontSize="small"
              sx={{ mt: "2px", color: "text.secondary" }}
            />
            <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
              Use <strong>semantic search</strong> and advanced filters
            </Typography>
          </Stack>
        </Stack>

        {/* CTA */}
        <Button
          variant="contained"
          onClick={onGetStarted}
          sx={{
            px: 3,
            py: 1,
            fontSize: "0.9rem",
            textTransform: "none",
            borderRadius: 2,
            boxShadow: "none",
          }}
        >
          Get started
        </Button>
      </Box>
    </Box>
  );
}