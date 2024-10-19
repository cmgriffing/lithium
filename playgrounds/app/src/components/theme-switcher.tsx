import { createSignal, createEffect } from "solid-js";

export function createThemeSwitcher() {
  const [isDarkMode, setIsDarkMode] = createSignal(false);

  createEffect(() => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "dark") {
      document.body.classList.toggle("dark", true);
      setIsDarkMode(true);
    } else if (currentTheme === "light") {
      document.body.classList.toggle("dark", false);
      setIsDarkMode(false);
    } else if (prefersDarkScheme.matches) {
      document.body.classList.toggle("dark", true);
      setIsDarkMode(true);
    }
  });

  const toggleDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    document.body.classList.toggle("dark", value);
    localStorage.setItem("theme", value ? "dark" : "light");
  };

  return [isDarkMode, toggleDarkMode] as const;
}