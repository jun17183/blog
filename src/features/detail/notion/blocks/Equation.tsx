import type { EquationBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  block: EquationBlockObjectResponse;
}

export function Equation({ block }: Props) {
  return (
    <div className="my-4 overflow-x-auto text-center">
      <code className="text-sm font-mono">{block.equation.expression}</code>
    </div>
  );
}
