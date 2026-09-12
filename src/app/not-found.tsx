import Link from "next/link";
import { HeaderActions } from "@/features/header/components/HeaderActions";

export default function NotFound() {
  return (
    <>
      <div className="flex items-center justify-end gap-4 mb-4">
        <HeaderActions />
      </div>
      <section className="rounded-2xl border border-border bg-surface px-8 py-20 text-center shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.08em] text-faint">404</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">페이지를 찾을 수 없습니다</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          삭제되었거나 주소가 바뀐 글일 수 있습니다.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-hover transition-colors"
        >
          전체 글 보기
        </Link>
      </section>
    </>
  );
}
