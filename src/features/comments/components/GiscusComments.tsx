"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

interface GiscusCommentsProps {
  term: string;
}

const GISCUS_REPO = process.env.NEXT_PUBLIC_GISCUS_REPO;
const GISCUS_REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const GISCUS_CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

function isRepoName(value: string): value is `${string}/${string}` {
  return value.includes("/");
}

export function GiscusComments({ term }: GiscusCommentsProps) {
  const { resolvedTheme } = useTheme();

  if (!GISCUS_REPO || !GISCUS_REPO_ID || !GISCUS_CATEGORY_ID || !isRepoName(GISCUS_REPO)) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <Giscus
        repo={GISCUS_REPO}
        repoId={GISCUS_REPO_ID}
        category="General"
        categoryId={GISCUS_CATEGORY_ID}
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
