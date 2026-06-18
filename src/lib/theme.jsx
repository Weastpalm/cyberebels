import { createContext, useContext, useEffect, useState } from "react";

export const THEMES = ["light", "dark", "hacker"];
const STORAGE_KEY = "cyberebels-theme";

const ThemeContext = createContext({ theme: "dark", setTheme: () => {} });

function readInitial() {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr && THEMES.includes(attr)) return attr;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEMES.includes(saved)) return saved;
  } catch (e) { /* ignore */ }
  return "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readInitial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
  }, [theme]);

  const setTheme = (t) => THEMES.includes(t) && setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
