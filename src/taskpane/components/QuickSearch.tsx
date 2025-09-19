// src/taskpane/components/QuickSearch.tsx
import * as React from "react";
import { Button, Tooltip } from "@mui/material";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";

type Props = {
  setSearchTerm: (t: string) => void;
  onRunSearch: (t: string) => void;
};

const CONTROL_MIN_HEIGHT = 48;

export default function QuickSearch({ setSearchTerm, onRunSearch }: Props) {
  const getDocumentText = async () => {
    try {
      await Word.run(async (context) => {
        const body = context.document.body;
        body.load("text");
        await context.sync();
        const text = (body.text || "").trim();
        if (text) {
          setSearchTerm(text);
          onRunSearch(text);
        }
      });
    } catch (error) {
      // Non-fatal UX: fail silently; console for devs
      // eslint-disable-next-line no-console
      console.error("QuickSearch: failed to read document text", error);
    }
  };

  return (
    <Tooltip title="Use the current document text as your search query">
      <span>
        <Button
          variant="outlined"
          size="medium"
          startIcon={<DocumentScannerOutlinedIcon />}
          onClick={getDocumentText}
          sx={{
            height: CONTROL_MIN_HEIGHT,
            textTransform: "none",
            fontWeight: 600,
            alignSelf: "flex-start",
          }}
        >
          Quick search
        </Button>
      </span>
    </Tooltip>
  );
}