import { RichText } from "../RichText";
import type {
  BulletedListItemBlockObjectResponse,
  NumberedListItemBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

interface BulletedProps {
  block: BulletedListItemBlockObjectResponse;
  children?: React.ReactNode;
}

export function BulletedListItem({ block, children }: BulletedProps) {
  return (
    <li className="notion-block whitespace-pre-wrap">
      <RichText richText={block.bulleted_list_item.rich_text} />
      {children}
    </li>
  );
}

interface NumberedProps {
  block: NumberedListItemBlockObjectResponse;
  children?: React.ReactNode;
}

export function NumberedListItem({ block, children }: NumberedProps) {
  return (
    <li className="notion-block whitespace-pre-wrap">
      <RichText richText={block.numbered_list_item.rich_text} />
      {children}
    </li>
  );
}
