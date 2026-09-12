import { RichText } from "../RichText";
import type { QuoteBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: QuoteBlockObjectResponse;
  children?: React.ReactNode;
}

export function Quote({ block, children }: Props) {
  return (
    <blockquote className="notion-block border-l-[3px] border-foreground pl-[14px]">
      <p className="whitespace-pre-wrap">
        <RichText richText={block.quote.rich_text} />
      </p>
      {children}
    </blockquote>
  );
}
