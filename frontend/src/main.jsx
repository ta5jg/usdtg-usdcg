import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import AdminPage from "./pages/AdminPage";
import LogsPage from "./pages/LogsPage"; // bunu az sonra oluşturacağız

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/logs" element={<LogsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


<Route path="/logs" element={<LogsPage />} />