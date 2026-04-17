import Link from "next/link";

interface TagProps {
  name: string;
}

export function Tag({ name }: TagProps) {
  return (
    <Link
      href={`/tags/${name}`}
      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      {name}
    </Link>
  );
}
