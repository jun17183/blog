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

function renderBlock(block: BlockWithChildren) {
  const children = block.children ? (
    <NotionRenderer blocks={block.children} />
  ) : null;

  switch (block.type) {
    case "paragraph":
      return <Paragraph key={block.id} block={block} />;
    case "heading_1":
    case "heading_2":
    case "heading_3":
      return <Heading key={block.id} block={block} />;
    case "code":
      return <CodeBlock key={block.id} block={block} />;
    case "image":
      return <ImageBlock key={block.id} block={block} />;
    case "callout":
      return <Callout key={block.id} block={block} />;
    case "quote":
      return <Quote key={block.id} block={block} />;
    case "bulleted_list_item":
      return <BulletedListItem key={block.id} block={block} />;
    case "numbered_list_item":
      return <NumberedListItem key={block.id} block={block} />;
    case "divider":
      return <Divider key={block.id} />;
    case "toggle":
      return <Toggle key={block.id} block={block}>{children}</Toggle>;
    case "bookmark":
      return <Bookmark key={block.id} block={block} />;
    case "to_do":
      return <TodoItem key={block.id} block={block} />;
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

export function NotionRenderer({ blocks }: NotionRendererProps) {
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "bulleted_list_item") {
      const items: React.ReactNode[] = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        items.push(renderBlock(blocks[i]));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-2 list-disc pl-6 space-y-1">
          {items}
        </ul>,
      );
      continue;
    }

    if (block.type === "numbered_list_item") {
      const items: React.ReactNode[] = [];
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        items.push(renderBlock(blocks[i]));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-2 list-decimal pl-6 space-y-1">
          {items}
        </ol>,
      );
      continue;
    }

    if (block.type === "to_do") {
      const items: React.ReactNode[] = [];
      while (i < blocks.length && blocks[i].type === "to_do") {
        items.push(renderBlock(blocks[i]));
        i++;
      }
      elements.push(
        <ul key={`todo-${i}`} className="my-2 space-y-1 pl-1">
          {items}
        </ul>,
      );
      continue;
    }

    elements.push(renderBlock(block));
    i++;
  }

  return <div className="prose-custom">{elements}</div>;
}
