import type { EmbedBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: EmbedBlockObjectResponse;
}

export function Embed({ block }: Props) {
  const caption = block.embed.caption.map((t) => t.plain_text).join("");

  return (
    <figure className="my-6">
      <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={block.embed.url}
          title={caption || "Embedded content"}
          sandbox="allow-scripts allow-same-origin allow-popups"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
