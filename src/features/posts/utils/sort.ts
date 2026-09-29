function dateValue(date: string): number {
  const time = date ? new Date(date).getTime() : NaN;
  return Number.isNaN(time) ? -Infinity : time;
}

/** 최신 글 순. 날짜가 없는 글은 맨 뒤. 원본 배열은 그대로 둔다. */
export function sortByDateDesc<T extends { date: string }>(posts: readonly T[]): T[] {
  return [...posts].sort((a, b) => dateValue(b.date) - dateValue(a.date));
}
