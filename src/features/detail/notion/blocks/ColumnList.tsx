import type { BlockWithChildren } from "@/lib/notion";
import { NotionRenderer } from "../NotionRenderer";

interface Props {
  block: BlockWithChildren;
}

export function ColumnList({ block }: Props) {
  const columns = block.children ?? [];

  return (
    <div className="my-2 flex flex-col gap-4 md:flex-row">
      {columns.map((column) => (
        <div key={column.id} className="flex-1 min-w-0">
          {column.children && <NotionRenderer blocks={column.children} />}
        </div>
      ))}
    </div>
  );
}
