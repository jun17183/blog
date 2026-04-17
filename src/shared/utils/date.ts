export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
