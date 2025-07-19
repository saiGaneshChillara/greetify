import { create } from "zustand"

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("greetify-theme") ||"coffee",
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem("greetify-theme", theme);
  },
}));