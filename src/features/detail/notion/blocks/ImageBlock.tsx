import type { ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: ImageBlockObjectResponse;
}

export function ImageBlock({ block }: Props) {
  const src =
    block.image.type === "file"
      ? block.image.file.url
      : block.image.external.url;

  const caption = block.image.caption.map((t) => t.plain_text).join("");

  return (
    <figure className="my-6 flex flex-col items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={caption || ""}
        className="max-w-full rounded-lg"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
