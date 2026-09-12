import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import type { CSSProperties } from "react";

interface RichTextProps {
  richText: RichTextItemResponse[];
}

const NOTION_COLOR_NAMES = [
  "gray",
  "brown",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "red",
] as const;

type NotionColorName = (typeof NOTION_COLOR_NAMES)[number];

function isNotionColorName(name: string): name is NotionColorName {
  return (NOTION_COLOR_NAMES as readonly string[]).includes(name);
}

/** Map a Notion annotation color to inline CSS backed by tokens in globals.css */
export function notionColorStyle(color: string): CSSProperties | undefined {
  if (color === "default") return undefined;

  const isBackground = color.endsWith("_background");
  const name = isBackground ? color.replace("_background", "") : color;
  if (!isNotionColorName(name)) return undefined;

  return isBackground
    ? { backgroundColor: `var(--notion-${name}-bg)` }
    : { color: `var(--notion-${name})` };
}

export function RichText({ richText }: RichTextProps) {
  return (
    <>
      {richText.map((text, i) => {
        const { bold, italic, strikethrough, underline, code, color } =
          text.annotations;

        let element: React.ReactNode = text.plain_text;

        if (code) {
          element = (
            <code className="rounded bg-muted px-1.5 py-0.5 text-[0.875em] font-mono text-notion-code">
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

        const style = notionColorStyle(color);
        return (
          <span key={i} style={style} className={style?.backgroundColor ? "rounded-sm px-0.5" : undefined}>
            {element}
          </span>
        );
      })}
    </>
  );
}
