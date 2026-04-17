import { RichText } from "../RichText";
import type { ToDoBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: ToDoBlockObjectResponse;
}

export function TodoItem({ block }: Props) {
  return (
    <li className="flex items-start gap-2 list-none">
      <input
        type="checkbox"
        checked={block.to_do.checked}
        readOnly
        className="mt-1 accent-accent"
      />
      <span className={block.to_do.checked ? "line-through text-muted-foreground" : ""}>
        <RichText richText={block.to_do.rich_text} />
      </span>
    </li>
  );
}
