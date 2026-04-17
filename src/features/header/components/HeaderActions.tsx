import { Rss } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <a
        href="/feed.xml"
        target="_blank"
        rel="noopener"
        className="flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-border cursor-pointer transition-all"
        aria-label="RSS feed"
      >
        <Rss size={16} />
      </a>
      <ThemeToggle />
    </div>
  );
}
