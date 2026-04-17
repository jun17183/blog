import { RichText } from "../RichText";
import type { CalloutBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: CalloutBlockObjectResponse;
}

export function Callout({ block }: Props) {
  const icon =
    block.callout.icon?.type === "emoji" ? block.callout.icon.emoji : "💡";

  return (
    <div className="my-4 flex gap-3 rounded-lg bg-muted p-4">
      <span className="text-lg shrink-0">{icon}</span>
      <div className="text-sm leading-relaxed">
        <RichText richText={block.callout.rich_text} />
      </div>
    </div>
  );
}
