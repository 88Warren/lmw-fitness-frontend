import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { register as ServiceWorkerRegistration } from "./serviceWorkerRegistration.js";

createRoot(document.getElementById("root")).render(
  <StrictMode data-oid="bm7-jws">
    <App data-oid="6n_i0yg" />
  </StrictMode>,
);

ServiceWorkerRegistration();
