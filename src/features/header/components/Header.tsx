import Link from "next/link";
import { Rss } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="text-base font-semibold tracking-tight text-foreground">
          Blog
        </Link>
        <nav className="flex items-center gap-3">
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center size-9 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            aria-label="RSS feed"
          >
            <Rss size={18} />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
