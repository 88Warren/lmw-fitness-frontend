import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { register as ServiceWorkerRegistration } from "./serviceWorkerRegistration.js";

createRoot(document.getElementById("root")).render(
  <StrictMode data-oid="v8t3we.">
    <App data-oid="dd8bimd" />
  </StrictMode>,
);

ServiceWorkerRegistration();
