import type { BookmarkBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: BookmarkBlockObjectResponse;
}

export function Bookmark({ block }: Props) {
  const caption = block.bookmark.caption.map((t) => t.plain_text).join("");

  return (
    <a
      href={block.bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-4 block rounded-lg border border-border p-4 text-sm hover:border-muted-foreground/30 transition-colors"
    >
      <span className="text-foreground">{caption || block.bookmark.url}</span>
      <span className="mt-1 block text-xs text-muted-foreground truncate">
        {block.bookmark.url}
      </span>
    </a>
  );
}
