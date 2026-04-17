import { codeToHtml } from "shiki";
import type { CodeBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: CodeBlockObjectResponse;
}

export async function CodeBlock({ block }: Props) {
  const code = block.code.rich_text.map((t) => t.plain_text).join("");
  const language = block.code.language || "text";

  const html = await codeToHtml(code, {
    lang: language === "plain text" ? "text" : language,
    theme: "github-dark",
  });

  return (
    <div className="my-4 overflow-hidden rounded-lg text-sm">
      {block.code.caption.length > 0 && (
        <div className="bg-muted px-4 py-2 text-xs text-muted-foreground">
          {block.code.caption.map((t) => t.plain_text).join("")}
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
