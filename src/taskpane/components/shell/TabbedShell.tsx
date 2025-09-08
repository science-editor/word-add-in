// src/taskpane/components/shell/TabbedShell.tsx
import * as React from "react";

export type TabKey = "discover" | "settings";

export function TabbedShell({
  value,
  onChange,
  children,
}: {
  value: TabKey;
  onChange: (k: TabKey) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="shell" role="application" aria-label="Endoc taskpane">
      <div className="shell__tabbar">
        <nav className="tabs" role="tablist" aria-label="Primary">
          <button
            role="tab"
            aria-selected={value === "discover"}
            className={`tab ${value === "discover" ? "is-active" : ""}`}
            onClick={() => onChange("discover")}
          >
            Discover
          </button>
          <button
            role="tab"
            aria-selected={value === "settings"}
            className={`tab ${value === "settings" ? "is-active" : ""}`}
            onClick={() => onChange("settings")}
          >
            Settings
          </button>
        </nav>
      </div>

      <div className="shell__content">{children}</div>
    </div>
  );
}