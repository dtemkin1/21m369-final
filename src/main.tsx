import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactFlowProvider } from "@xyflow/react";
import { ThemeProvider } from "@/components/theme-provider";

import App from "./App.tsx";

import "@xyflow/react/dist/style.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider storageKey="ui-theme" defaultTheme="system">
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlowProvider>
          <App />
        </ReactFlowProvider>
      </div>
    </ThemeProvider>
  </StrictMode>
);
