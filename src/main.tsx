import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import InfinteScroll from "./infinte-scroll/";
import FileExplorer from "./file-explorer/";
import TabPanel from "./tab-panel/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="infinte-scroll" element={<InfinteScroll />} />
        <Route path="explorer" element={<FileExplorer />} />
        <Route path="tabs" element={<TabPanel />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
