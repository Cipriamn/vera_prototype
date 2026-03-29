import { useCallback, useState } from "react";

const STORAGE_KEY = "vera-builder-theme";

export type BuilderTheme = "light" | "dark";

function readStoredTheme(): BuilderTheme | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === "dark" || raw === "light") return raw;
  return null;
}

export function useBuilderTheme() {
  const [theme, setThemeState] = useState<BuilderTheme>(() => {
    return readStoredTheme() ?? "light";
  });

  const setTheme = useCallback((next: BuilderTheme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { theme, setTheme, toggleTheme, isDark: theme === "dark" };
}
