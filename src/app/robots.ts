import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/shared/utils/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
