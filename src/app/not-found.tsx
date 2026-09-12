import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pt-24 pb-16 text-center">
      <p className="text-xs text-faint">404</p>
      <h1 className="mt-3 text-2xl font-medium tracking-[-0.03em]">페이지를 찾을 수 없습니다</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        삭제되었거나 주소가 바뀐 글일 수 있습니다.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block border-b border-foreground pb-px text-sm hover:text-muted-foreground hover:border-muted-foreground transition-colors"
      >
        전체 글 보기
      </Link>
    </section>
  );
}
