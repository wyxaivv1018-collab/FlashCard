import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "时政闪卡 - 考公考编必备",
  description: "时政刷卡学习工具，高效备考公务员考试",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="max-w-lg mx-auto px-4 pb-24 pt-4">{children}</main>
      </body>
    </html>
  );
}
