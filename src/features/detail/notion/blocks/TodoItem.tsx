import { RichText } from "../RichText";
import type { ToDoBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: ToDoBlockObjectResponse;
  children?: React.ReactNode;
}

export function TodoItem({ block, children }: Props) {
  return (
    <li className="notion-block list-none">
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={block.to_do.checked}
          readOnly
          className="mt-[0.45em] accent-accent"
        />
        <span
          className={`whitespace-pre-wrap ${block.to_do.checked ? "line-through text-muted-foreground" : ""}`}
        >
          <RichText richText={block.to_do.rich_text} />
        </span>
      </div>
      {children && <div className="notion-indent">{children}</div>}
    </li>
  );
}
