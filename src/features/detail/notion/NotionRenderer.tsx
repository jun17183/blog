import type { BlockWithChildren } from "@/lib/notion";
import { Paragraph } from "./blocks/Paragraph";
import { Heading } from "./blocks/Heading";
import { CodeBlock } from "./blocks/CodeBlock";
import { ImageBlock } from "./blocks/ImageBlock";
import { Callout } from "./blocks/Callout";
import { Quote } from "./blocks/Quote";
import { BulletedListItem, NumberedListItem } from "./blocks/List";
import { Divider } from "./blocks/Divider";
import { Toggle } from "./blocks/Toggle";
import { Bookmark } from "./blocks/Bookmark";
import { TodoItem } from "./blocks/TodoItem";
import { Table } from "./blocks/Table";
import { Video } from "./blocks/Video";
import { Equation } from "./blocks/Equation";
import { Embed } from "./blocks/Embed";
import { ColumnList } from "./blocks/ColumnList";

interface NotionRendererProps {
  blocks: BlockWithChildren[];
}

type ListGroupType = "bulleted_list_item" | "numbered_list_item" | "to_do";

const LIST_GROUP_CLASS: Record<ListGroupType, string> = {
  bulleted_list_item: "list-disc pl-6 marker:text-foreground",
  numbered_list_item: "list-decimal pl-6 marker:text-foreground",
  to_do: "pl-0",
};

function isListGroupType(type: string): type is ListGroupType {
  return type in LIST_GROUP_CLASS;
}

function renderBlock(block: BlockWithChildren) {
  // Notion에서 들여쓰기된 하위 블록. 부모 블록 안에 렌더한다.
  const children = block.children ? (
    <NotionRenderer blocks={block.children} />
  ) : null;

  switch (block.type) {
    case "paragraph":
      return <Paragraph key={block.id} block={block}>{children}</Paragraph>;
    case "heading_1":
    case "heading_2":
    case "heading_3":
      return <Heading key={block.id} block={block} />;
    case "code":
      return <CodeBlock key={block.id} block={block} />;
    case "image":
      return <ImageBlock key={block.id} block={block} />;
    case "callout":
      return <Callout key={block.id} block={block}>{children}</Callout>;
    case "quote":
      return <Quote key={block.id} block={block}>{children}</Quote>;
    case "bulleted_list_item":
      return <BulletedListItem key={block.id} block={block}>{children}</BulletedListItem>;
    case "numbered_list_item":
      return <NumberedListItem key={block.id} block={block}>{children}</NumberedListItem>;
    case "divider":
      return <Divider key={block.id} />;
    case "toggle":
      return <Toggle key={block.id} block={block}>{children}</Toggle>;
    case "bookmark":
      return <Bookmark key={block.id} block={block} />;
    case "to_do":
      return <TodoItem key={block.id} block={block}>{children}</TodoItem>;
    case "table":
      return <Table key={block.id} block={block} />;
    case "video":
      return <Video key={block.id} block={block} />;
    case "equation":
      return <Equation key={block.id} block={block} />;
    case "embed":
      return <Embed key={block.id} block={block} />;
    case "column_list":
      return <ColumnList key={block.id} block={block} />;
    case "column":
      return children;
    case "table_row":
      return null; // table 내부에서 처리
    default:
      return null;
  }
}

/**
 * 연속된 리스트 아이템 블록을 하나의 <ul>/<ol>로 묶는다.
 * Notion API는 리스트를 개별 블록으로 주기 때문에 여기서 그룹핑한다.
 */
export function NotionRenderer({ blocks }: NotionRendererProps) {
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (isListGroupType(block.type)) {
      const groupType = block.type;
      const items: React.ReactNode[] = [];
      while (i < blocks.length && blocks[i].type === groupType) {
        items.push(renderBlock(blocks[i]));
        i++;
      }
      const ListTag = groupType === "numbered_list_item" ? "ol" : "ul";
      elements.push(
        <ListTag key={`${groupType}-${block.id}`} className={LIST_GROUP_CLASS[groupType]}>
          {items}
        </ListTag>,
      );
      continue;
    }

    elements.push(renderBlock(block));
    i++;
  }

  return <>{elements}</>;
}
