import * as React from "react";
import { nanoid } from "nanoid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Paper as PaperType } from "../types";

import PaperMetaLine from "./PaperMetaLine";

const ZOTERO_ICON_URL =
  "https://raw.githubusercontent.com/science-editor/word-add-in/refs/heads/main/assets/zotero-icon.ico";

export default function SearchResultsPanel({
  foundPapers,
  handleClickReadPaper,
  handleClickZoteroBtn,
}: {
  foundPapers: PaperType[];
  handleClickReadPaper: (p: PaperType) => void;
  handleClickZoteroBtn: (p: PaperType) => Promise<any> | any;
}) {
  const [addingIds, setAddingIds] = React.useState<Set<string>>(new Set());

  const getKey = (p: any) => p.id ?? p.DOI ?? p.title ?? nanoid();

  const addStart = (id: string) => setAddingIds((s) => new Set(s).add(id));
  const addStop = (id: string) =>
    setAddingIds((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });

  const onAddClick = async (paper: any) => {
    const id = getKey(paper);
    addStart(id);
    try {
      await handleClickZoteroBtn(paper);
    } finally {
      addStop(id);
    }
  };

  return (
    <>
      {foundPapers?.map((paper) => {
        const key = getKey(paper);
        const isAdding = addingIds.has(key);

        const titleTooLong = paper.title.length > 100;
        const truncatedTitle = titleTooLong
          ? `${paper.title.substring(0, 100)}…`
          : paper.title;

        return (
          <Paper
            key={key}
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              border: (t) => `1px solid ${t.palette.divider}`,
              borderRadius: 1.5,
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                columnGap: 2,
                alignItems: "start",
              }}
            >
              {/* Left side: title + metadata */}
              <Box sx={{ minWidth: 0 }}>
                {titleTooLong ? (
                  <Tooltip
                    title={paper.title}
                    componentsProps={{
                      tooltip: { sx: { fontSize: "1.2rem", lineHeight: 1.4 } },
                    }}
                  >
                    <h3 style={{ margin: 0 }}>{truncatedTitle}</h3>
                  </Tooltip>
                ) : (
                  <h3 style={{ margin: 0 }}>{truncatedTitle}</h3>
                )}
                <Box sx={{ mt: 0.5 }}>
                  <PaperMetaLine paper={paper} />
                </Box>
              </Box>

              {/* Right side: action icons */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  alignItems: "flex-end",
                  justifySelf: "end",
                }}
              >
                <Tooltip title="Expand this paper">
                  <IconButton
                    aria-label="Expand paper"
                    size="small"
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                    }}
                    onClick={() => handleClickReadPaper(paper)}
                  >
                    <MenuBookIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Add to Zotero">
                  <span>
                    <IconButton
                      aria-label="Add to Zotero"
                      size="small"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                      }}
                      onClick={() => onAddClick(paper)}
                      disabled={isAdding}
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
              </Box>
            </Box>
          </Paper>
        );
      })}
    </>
  );
}