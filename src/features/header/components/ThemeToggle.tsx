"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-border cursor-pointer transition-all"
      aria-label="Toggle theme"
    >
      <Sun size={16} className="hidden dark:block" />
      <Moon size={16} className="block dark:hidden" />
    </button>
  );
}
