import { RichText } from "../RichText";
import { headingAnchorId } from "../toc";
import type {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

type HeadingBlock =
  | Heading1BlockObjectResponse
  | Heading2BlockObjectResponse
  | Heading3BlockObjectResponse;

interface Props {
  block: HeadingBlock;
}

// Notion 기준: h1 1.875em / h2 1.5em / h3 1.25em, 위 여백 2em / 1.4em / 1em, 아래 여백은 한 블록 간격.
// 글 제목이 <h1>이므로 Notion heading_1은 <h2>부터 시작한다.
const HEADING_CONFIG = {
  heading_1: { Tag: "h2" as const, className: "text-[1.375em] mt-[2em]" },
  heading_2: { Tag: "h3" as const, className: "text-[1.25em] mt-[1.8em]" },
  heading_3: { Tag: "h4" as const, className: "text-[1.125em] mt-[1.5em]" },
};

export function Heading({ block }: Props) {
  const { Tag, className } = HEADING_CONFIG[block.type];
  const richText =
    block.type === "heading_1"
      ? block.heading_1.rich_text
      : block.type === "heading_2"
        ? block.heading_2.rich_text
        : block.heading_3.rich_text;

  return (
    <Tag
      id={headingAnchorId(block.id)}
      className={`notion-block scroll-mt-24 font-semibold leading-[1.35] mb-2 whitespace-pre-wrap ${className}`}
    >
      <RichText richText={richText} />
    </Tag>
  );
}
