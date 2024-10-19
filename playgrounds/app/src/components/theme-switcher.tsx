import { createSignal, createEffect } from "solid-js";

export function createThemeSwitcher() {
  const [isDarkMode, setIsDarkMode] = createSignal(false);

  createEffect(() => {
    // Check for dark mode preference at the system level
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Get the user's theme preference from local storage, if it's available
    const currentTheme = localStorage.getItem("theme");

    // If the user's preference in localStorage is dark...
    if (currentTheme === "dark") {
      // ...let's toggle the .dark-theme class on the body
      document.body.classList.toggle("dark", true);
      setIsDarkMode(true);
    // Otherwise, if the user's preference in localStorage is light...
    } else if (currentTheme === "light") {
      document.body.classList.toggle("dark", false);
      setIsDarkMode(false);
    // If the user hasn't made a preference, let's check the system preference
    } else if (prefersDarkScheme.matches) {
      document.body.classList.toggle("dark", true);
      setIsDarkMode(true);
    }
  });

  const toggleDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    console.log('boink');
    document.body.classList.toggle("dark", value);
    localStorage.setItem("theme", value ? "dark" : "light");
  };

  return [isDarkMode, toggleDarkMode] as const;
}