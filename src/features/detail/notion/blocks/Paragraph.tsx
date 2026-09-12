import { RichText } from "../RichText";
import type { ParagraphBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: ParagraphBlockObjectResponse;
  children?: React.ReactNode;
}

export function Paragraph({ block, children }: Props) {
  // Notion에서 빈 블록은 한 줄 높이의 여백으로 쓰인다. 같은 높이로 재현한다.
  if (block.paragraph.rich_text.length === 0) {
    return <div aria-hidden className="notion-block h-[1lh]" />;
  }

  return (
    <>
      <p className="notion-block whitespace-pre-wrap">
        <RichText richText={block.paragraph.rich_text} />
      </p>
      {children && <div className="notion-indent">{children}</div>}
    </>
  );
}
