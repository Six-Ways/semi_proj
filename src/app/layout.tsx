import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChapterTransitionProvider } from "@/components/templates/ChapterTransition";
import { MainNavigation } from "@/components/ui/MainNavigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "硅基文明求索 - 从原子到系统的完整知识体系",
  description: "探索半导体技术的完整知识链，从微观基石到未来趋势。涵盖量子物理、材料科学、器件原理、工艺技术和系统设计。",
  keywords: "半导体, 半导体物理, 半导体器件, 半导体工艺, 量子物理, 材料科学, 器件原理, 工艺技术, 系统设计",
  authors: [{ name: "硅基文明求索" }],
  creator: "硅基文明求索",
  publisher: "硅基文明求索",
  openGraph: {
    title: "硅基文明求索 - 从原子到系统的完整知识体系",
    description: "探索半导体技术的完整知识链，从微观基石到未来趋势。涵盖量子物理、材料科学、器件原理、工艺技术和系统设计。",
    type: "website",
    siteName: "硅基文明求索",
  },
  twitter: {
    card: "summary_large_image",
    title: "硅基文明求索 - 从原子到系统的完整知识体系",
    description: "探索半导体技术的完整知识链，从微观基石到未来趋势。涵盖量子物理、材料科学、器件原理、工艺技术和系统设计。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ChapterTransitionProvider>
          <MainNavigation />
          <main className="min-h-screen">
            {children}
          </main>
        </ChapterTransitionProvider>
      </body>
    </html>
  );
}
