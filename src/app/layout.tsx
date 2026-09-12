import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { SiteHeader } from "@/features/header/components/SiteHeader";
import { getSiteUrl } from "@/shared/utils/site";
import "./globals.css";

const SITE_NAME = "Blog";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: "Personal blog",
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-dvh bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="mx-auto w-full max-w-[1200px] px-6 pt-7 pb-20 md:px-9 md:pt-12">
            <div className="site-columns">
              <div className="col-main min-w-0">
                <SiteHeader />
              </div>
            </div>
            <main className="min-w-0">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
