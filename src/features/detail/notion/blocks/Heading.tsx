import { RichText } from "../RichText";
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

export function Heading({ block }: Props) {
  const config = {
    heading_1: { Tag: "h2" as const, className: "text-2xl font-bold mt-10 mb-4" },
    heading_2: { Tag: "h3" as const, className: "text-xl font-bold mt-8 mb-3" },
    heading_3: { Tag: "h4" as const, className: "text-lg font-semibold mt-6 mb-2" },
  };

  const { Tag, className } = config[block.type];
  const richText =
    block.type === "heading_1"
      ? block.heading_1.rich_text
      : block.type === "heading_2"
        ? block.heading_2.rich_text
        : block.heading_3.rich_text;

  return (
    <Tag className={className}>
      <RichText richText={richText} />
    </Tag>
  );
}
