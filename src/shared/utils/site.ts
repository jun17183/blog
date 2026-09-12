const DEFAULT_SITE_URL = "http://localhost:3000";

/**
 * 절대 URL이 필요한 곳(metadataBase, RSS, sitemap)에서 쓰는 사이트 주소.
 * NEXT_PUBLIC_SITE_URL이 없으면 Vercel이 주입하는 프로덕션 도메인을 쓴다.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return `https://${vercelProd}`;

  return DEFAULT_SITE_URL;
}
