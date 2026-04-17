import type { VideoBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: VideoBlockObjectResponse;
}

export function Video({ block }: Props) {
  const src =
    block.video.type === "file"
      ? block.video.file.url
      : block.video.external.url;

  const caption = block.video.caption.map((t) => t.plain_text).join("");

  // YouTube/Vimeo embed
  const youtubeMatch = src.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
  );
  if (youtubeMatch) {
    return (
      <figure className="my-6">
        <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
            title={caption || "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
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

  return (
    <figure className="my-6">
      <video src={src} controls className="w-full rounded-lg">
        <track kind="captions" />
      </video>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
