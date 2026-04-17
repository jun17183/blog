import { RichText } from "../RichText";
import type {
  BulletedListItemBlockObjectResponse,
  NumberedListItemBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

interface BulletedProps {
  block: BulletedListItemBlockObjectResponse;
}

export function BulletedListItem({ block }: BulletedProps) {
  return (
    <li>
      <RichText richText={block.bulleted_list_item.rich_text} />
    </li>
  );
}

interface NumberedProps {
  block: NumberedListItemBlockObjectResponse;
}

export function NumberedListItem({ block }: NumberedProps) {
  return (
    <li>
      <RichText richText={block.numbered_list_item.rich_text} />
    </li>
  );
}
