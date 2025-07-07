import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById("react-pact-map")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
