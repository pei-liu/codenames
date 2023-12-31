import React from "react";
import { createRoot } from 'react-dom/client';
import App from "../components/App";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.body.appendChild(document.createElement("div"));
  const root = createRoot(container);
  root.render(
    <App />
  );
});
