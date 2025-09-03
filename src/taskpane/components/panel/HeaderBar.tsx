import * as React from "react";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import QuickSearch from "../QuickSearch";

export function HeaderBar({
  apiKey,
  onOpenSettings,
  onQuickSearch,
}: {
  apiKey: string;
  onOpenSettings: () => void;
  onQuickSearch: (text: string) => void;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <QuickSearch setSearchTerm={onQuickSearch as any} handleClickSearchBtn={onQuickSearch} />
      <IconButton
        className={apiKey ? "" : "attention-pulse"}
        aria-label="Endoc API Key help"
        size="medium"
        sx={{ width: 32, height: 32, borderRadius: "50%" }}
        onClick={onOpenSettings}
      >
        <SettingsIcon fontSize="inherit" />
      </IconButton>
    </div>
  );
}