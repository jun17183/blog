import { Rss } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { BackButton } from "@/features/detail/components/BackButton";

export function TopBar() {
  return (
    <div className="flex items-center justify-between px-6 lg:px-10 pt-6 pb-2">
      <BackButton />
      <div className="flex items-center gap-2">
        <a
          href="/feed.xml"
          target="_blank"
          rel="noopener"
          className="flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-all"
          aria-label="RSS feed"
        >
          <Rss size={16} />
        </a>
        <ThemeToggle />
      </div>
    </div>
  );
}
