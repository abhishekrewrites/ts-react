import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import InfinteScroll from "./infinte-scroll/";
import FileExplorer from "./file-explorer/";
import TabPanel from "./tab-panel/";
import Menu from "./Menu/";
import JobBoard from "./job-board/";
import Table from "./table/";
import Grid from "./reverse-grid/";
import TodoList from "./todo-list/";
import ImageCarousel from "./image-carousel/";
import MockDataTable from "./data-mock-server/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="infinte-scroll" element={<InfinteScroll />} />
        <Route path="explorer" element={<FileExplorer />} />
        <Route path="tabs" element={<TabPanel />} />
        <Route path="menu" element={<Menu />} />
        <Route path="job-board" element={<JobBoard />} />
        <Route path="table" element={<Table />} />
        <Route path="reverse" element={<Grid />} />
        <Route path="todo" element={<TodoList />} />
        <Route path="carousel" element={<ImageCarousel />} />
        <Route path="mock-table" element={<MockDataTable />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
