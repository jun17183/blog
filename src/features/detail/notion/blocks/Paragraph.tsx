import { RichText } from "../RichText";
import type { ParagraphBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: ParagraphBlockObjectResponse;
}

export function Paragraph({ block }: Props) {
  if (block.paragraph.rich_text.length === 0) {
    return <div className="h-4" />;
  }

  return (
    <p>
      <RichText richText={block.paragraph.rich_text} />
    </p>
  );
}
