import { RichText, notionColorStyle } from "../RichText";
import type { CalloutBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: CalloutBlockObjectResponse;
  children?: React.ReactNode;
}

export function Callout({ block, children }: Props) {
  const icon =
    block.callout.icon?.type === "emoji" ? block.callout.icon.emoji : "💡";
  const style = notionColorStyle(block.callout.color);

  return (
    <div
      className={`my-1 flex gap-3 rounded-md py-4 pl-3 pr-4 ${style ? "" : "bg-muted"}`}
      style={style}
    >
      <span className="text-[1.2em] leading-[1.65] shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="whitespace-pre-wrap">
          <RichText richText={block.callout.rich_text} />
        </p>
        {children}
      </div>
    </div>
  );
}
