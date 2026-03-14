import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply cached theme before first paint to avoid flash
const cachedTheme = localStorage.getItem('pf_theme_preference');
if (cachedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById("root")!).render(<App />);
