"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

interface GiscusCommentsProps {
  term: string;
}

export function GiscusComments({ term }: GiscusCommentsProps) {
  const { resolvedTheme } = useTheme();

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <Giscus
        repo={process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`}
        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID!}
        category="General"
        categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!}
        mapping="specific"
        term={term}
        reactionsEnabled="0"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === "dark" ? "transparent_dark" : "light"}
        lang="ko"
      />
    </section>
  );
}
