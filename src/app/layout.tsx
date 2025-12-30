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
  title: "半导体物理与器件 - 可探索式解释",
  description: "一个关于半导体物理与器件的交互式教育网站",
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
