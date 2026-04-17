import { RichText } from "../RichText";
import type { ToggleBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: ToggleBlockObjectResponse;
  children?: React.ReactNode;
}

export function Toggle({ block, children }: Props) {
  return (
    <details className="my-2">
      <summary className="cursor-pointer font-medium">
        <RichText richText={block.toggle.rich_text} />
      </summary>
      <div className="pl-4 mt-2">{children}</div>
    </details>
  );
}
