import { useEffect, useState } from "react";
import { getCookie, setCookie } from "../lib/cookies";

const KEY = "lipi-theme";

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    // Cookie first, fallback to legacy localStorage
    const fromCookie = getCookie(KEY);
    if (fromCookie === "light" || fromCookie === "dark") return fromCookie;
    try {
      const ls = localStorage.getItem(KEY);
      if (ls === "light" || ls === "dark") return ls;
    } catch {
      /* ignore */
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    setCookie(KEY, theme, 365);
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return { theme, toggle, setTheme };
};
