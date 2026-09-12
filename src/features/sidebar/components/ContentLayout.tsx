import { getAllSeries } from "@/lib/notion";
import { SeriesNav } from "./SeriesNav";

interface ContentLayoutProps {
  children: React.ReactNode;
  /** 우측 컬럼 (상세 페이지의 목차). 없으면 폭 맞추기용 빈 컬럼. */
  right?: React.ReactNode;
  /** 상세 페이지에서 글이 속한 시리즈를 활성 표시할 때. */
  activeSeries?: string | null;
}

/**
 * 모든 페이지 공통 3단 골격: 시리즈(스티키) · 본문 · 우측(스티키).
 * 본문 폭은 어느 페이지에서나 같아서 목록과 글이 같은 자리에 놓인다.
 */
export async function ContentLayout({ children, right, activeSeries }: ContentLayoutProps) {
  const seriesNames = await getAllSeries();

  return (
    <div className="site-columns gap-y-8 pt-8 lg:pt-12">
      <aside className="col-left lg:sticky lg:top-8 lg:h-max">
        <SeriesNav seriesNames={seriesNames} activeSeries={activeSeries} />
      </aside>
      <div className="col-main min-w-0">{children}</div>
      <aside className="col-right hidden lg:block lg:sticky lg:top-8 lg:h-max">{right}</aside>
    </div>
  );
}
