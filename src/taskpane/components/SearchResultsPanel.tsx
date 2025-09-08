// src/taskpane/components/SearchResultsPanel.tsx
import * as React from "react";
import { nanoid } from "nanoid"; // retained, but no longer used in render keys
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import { Paper as PaperType } from "../types";
import PaperMetaLine from "./PaperMetaLine";

const ZOTERO_ICON_URL =
  "https://raw.githubusercontent.com/science-editor/word-add-in/refs/heads/main/assets/zotero-icon.ico";

/** Create a stable key for each paper so state maps to the right row.
 *  Prefers server ids, otherwise DOI, otherwise a normalized title.
 */
function makeStableKey(p: any): string {
  if (p?.id) return String(p.id);
  if (p?.DOI) return String(p.DOI);
  const t = (p?.title ?? "").toString().trim().toLowerCase();
  // Last resort: deterministic fallback; avoid random ids during render
  return `t:${t}`;
}

export default function SearchResultsPanel({
  foundPapers,
  handleClickReadPaper,
  handleClickZoteroBtn,
}: {
  foundPapers: PaperType[];
  handleClickReadPaper: (p: PaperType) => void;
  handleClickZoteroBtn: (p: PaperType) => Promise<any> | any;
}) {
  // Track which rows are currently adding to Zotero and which are added
  const [addingIds, setAddingIds] = React.useState<Set<string>>(new Set());
  const [addedIds, setAddedIds] = React.useState<Set<string>>(new Set());

  const onAddClick = async (paper: PaperType, e?: React.MouseEvent) => {
    e?.stopPropagation(); // don’t trigger card expand
    const key = makeStableKey(paper);
    setAddingIds((prev) => new Set(prev).add(key));
    try {
      await handleClickZoteroBtn(paper);
      setAddedIds((prev) => new Set(prev).add(key));
    } finally {
      setAddingIds((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const onExpand = (paper: PaperType) => handleClickReadPaper(paper);
  const onKeyActivate = (paper: PaperType, e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClickReadPaper(paper);
    }
  };

  return (
    <>
      {foundPapers?.map((paper) => {
        const key = makeStableKey(paper);
        const isAdding = addingIds.has(key);
        const isAdded = addedIds.has(key);

        const title = paper.title ?? "";
        const titleTooLong = title.length > 100;
        const truncatedTitle = titleTooLong ? `${title.substring(0, 100)}…` : title;

        return (
          <Paper
            key={key}
            elevation={0}
            role="button"
            tabIndex={0}
            onClick={() => onExpand(paper)}
            onKeyDown={(e) => onKeyActivate(paper, e)}
            sx={{
              p: 2,
              mb: 2,
              border: (t) => `1px solid ${t.palette.divider}`,
              borderRadius: 1.5,
              cursor: "pointer",
              outline: "none",
              "&:focus-visible": {
                boxShadow: (t) => `0 0 0 2px ${t.palette.primary.main}33`,
              },
              "&:hover": {
                backgroundColor: (t) =>
                  t.palette.mode === "dark"
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(0,0,0,0.02)",
              },
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                columnGap: 2,
                alignItems: "center", // keeps Zotero icon vertically centered next to text block
              }}
            >
              {/* Left: title + metadata */}
              <Box sx={{ minWidth: 0 }}>
                {titleTooLong ? (
                  <Tooltip
                    title={title}
                    componentsProps={{
                      tooltip: { sx: { fontSize: "1.2rem", lineHeight: 1.4 } },
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        lineHeight: 1.3,
                        wordBreak: "break-word",
                      }}
                    >
                      {truncatedTitle}
                    </h3>
                  </Tooltip>
                ) : (
                  <h3
                    style={{
                      margin: 0,
                      lineHeight: 1.3,
                      wordBreak: "break-word",
                    }}
                  >
                    {truncatedTitle}
                  </h3>
                )}

                <Box sx={{ mt: 0.5 }}>
                  <PaperMetaLine paper={paper} />
                </Box>
              </Box>

              {/* Right: Zotero button (icon only). Shows spinner while adding; becomes green check when done */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                {isAdded ? (
                  <IconButton
                    aria-label="Added to Zotero"
                    size="small"
                    disabled
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: "success.main",
                      color: "#fff",
                      "&:hover": { bgcolor: "success.main" },
                    }}
                  >
                    <CheckIcon fontSize="small" />
                  </IconButton>
                ) : (
                  <Tooltip title={isAdding ? "Adding…" : "Add to Zotero"}>
                    <span>
                      <IconButton
                        aria-label="Add to Zotero"
                        size="small"
                        disabled={isAdding}
                        onClick={(e) => onAddClick(paper, e)}
                        sx={{ width: 32, height: 32, borderRadius: "50%" }}
                      >
                        {isAdding ? (
                          <CircularProgress size={18} color="inherit" />
                        ) : (
                          <img
                            src={ZOTERO_ICON_URL}
                            alt="Zotero"
                            width={18}
                            height={18}
                            style={{ display: "block" }}
                          />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Paper>
        );
      })}
    </>
  );
}