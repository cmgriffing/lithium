import { createSignal, createEffect } from "solid-js";
import { makePersisted } from "@solid-primitives/storage";

export function createThemeSwitcher() {
  const [isDarkMode, setIsDarkMode] = makePersisted(createSignal(false), {
    name: "isDarkMode",
    storage: localStorage,
  });

  createEffect(() => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    
    if (isDarkMode()) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    if (isDarkMode() === null) {
      setIsDarkMode(prefersDarkScheme.matches);
    }
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode());
  };

  return [isDarkMode, toggleDarkMode] as const;
}