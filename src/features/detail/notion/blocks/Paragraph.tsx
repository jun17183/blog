import { RichText } from "../RichText";
import type { ParagraphBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: ParagraphBlockObjectResponse;
  children?: React.ReactNode;
}

export function Paragraph({ block, children }: Props) {
  // Notion의 빈 블록(엔터 두 번)은 문단 간격 위에 추가되는 여백으로만 쓴다.
  if (block.paragraph.rich_text.length === 0) {
    return <div aria-hidden className="notion-blank" />;
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
