import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/features/sidebar/components/Sidebar";
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
          <Sidebar />
          <main className="min-w-0 lg:ml-[260px] px-6 lg:px-10 py-6">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
