import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { register as ServiceWorkerRegistration } from "./serviceWorkerRegistration.js";
import { CartProvider } from './context/CartContext.jsx';

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.theme = "dark";
  } else if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.theme = "light";
  } else {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
    localStorage.removeItem("theme");
  }
}

const storedTheme = localStorage.theme;
if (storedTheme) {
  applyTheme(storedTheme);
} else {
  applyTheme("system");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
);

ServiceWorkerRegistration();
