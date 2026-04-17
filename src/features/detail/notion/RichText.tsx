import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

interface RichTextProps {
  richText: RichTextItemResponse[];
}

export function RichText({ richText }: RichTextProps) {
  return (
    <>
      {richText.map((text, i) => {
        const {
          bold,
          italic,
          strikethrough,
          underline,
          code,
          color,
        } = text.annotations;

        let element: React.ReactNode = text.plain_text;

        if (code) {
          element = (
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
              {element}
            </code>
          );
        }
        if (bold) element = <strong>{element}</strong>;
        if (italic) element = <em>{element}</em>;
        if (strikethrough) element = <s>{element}</s>;
        if (underline) element = <u>{element}</u>;

        if (text.href) {
          element = (
            <a
              href={text.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 text-accent hover:text-foreground transition-colors"
            >
              {element}
            </a>
          );
        }

        const style =
          color !== "default"
            ? { color: color.endsWith("_background") ? undefined : color }
            : undefined;
        const bgClass = color.endsWith("_background")
          ? `bg-${color.replace("_background", "")}-100/20`
          : undefined;

        return (
          <span key={i} style={style} className={bgClass}>
            {element}
          </span>
        );
      })}
    </>
  );
}
