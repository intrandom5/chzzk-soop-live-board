import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chzzk + Soop Live Board",
  description: "치지직과 SOOP 스트리머들의 라이브 상태를 한눈에 확인하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen bg-[#0f0f0f]">
        {children}
      </body>
    </html>
  );
}
