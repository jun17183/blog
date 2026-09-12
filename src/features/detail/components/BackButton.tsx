"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") return <div />;

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 text-[13px] text-faint hover:text-foreground cursor-pointer transition-colors"
    >
      <ArrowLeft size={14} />
      <span>Back</span>
    </button>
  );
}
