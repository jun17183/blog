import { RichText } from "../RichText";
import type { BlockWithChildren } from "@/lib/notion";
import type { TableRowBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: BlockWithChildren;
}

export function Table({ block }: Props) {
  const rows = (block.children ?? []).filter(
    (b): b is TableRowBlockObjectResponse & { children?: BlockWithChildren[] } =>
      b.type === "table_row",
  );

  if (rows.length === 0) return null;

  const hasColumnHeader =
    block.type === "table" && block.table.has_column_header;
  const hasRowHeader =
    block.type === "table" && block.table.has_row_header;

  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id} className="border-b border-border">
              {row.table_row.cells.map((cell, cellIndex) => {
                const isHeader =
                  (hasColumnHeader && rowIndex === 0) ||
                  (hasRowHeader && cellIndex === 0);
                const Tag = isHeader ? "th" : "td";

                return (
                  <Tag
                    key={cellIndex}
                    className={`px-3 py-2 text-left ${isHeader ? "font-semibold bg-muted" : ""}`}
                  >
                    <RichText richText={cell} />
                  </Tag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
