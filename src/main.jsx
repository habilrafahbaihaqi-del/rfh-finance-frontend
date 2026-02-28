import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// 1. Import HelmetProvider
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 2. Bungkus App dengan HelmetProvider */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);
