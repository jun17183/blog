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
      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-border cursor-pointer transition-all"
    >
      <ArrowLeft size={16} />
      <span>뒤로가기</span>
    </button>
  );
}
