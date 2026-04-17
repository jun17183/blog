import { RichText } from "../RichText";
import type { QuoteBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: QuoteBlockObjectResponse;
}

export function Quote({ block }: Props) {
  return (
    <blockquote className="my-4 border-l-4 border-border pl-4 text-muted-foreground italic">
      <RichText richText={block.quote.rich_text} />
    </blockquote>
  );
}
