import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className=" p-2 rounded-full border transition bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      title={`Chuyển sang chế độ ${isDark ? "sáng" : "tối"}`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
