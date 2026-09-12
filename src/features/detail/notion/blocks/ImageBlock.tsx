import type { ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: ImageBlockObjectResponse;
}

export function ImageBlock({ block }: Props) {
  // Notion 파일 URL은 약 1시간 뒤 만료되므로 썸네일과 동일하게 프록시를 거친다.
  const src = `/api/notion-image/block/${block.id}`;
  const caption = block.image.caption.map((t) => t.plain_text).join("");

  return (
    <figure className="my-2 flex flex-col items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={caption || ""} className="max-w-full rounded-lg" />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
