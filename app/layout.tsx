import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "직UP | 직업공통능력 인증 준비",
  description: "나에게 맞는 속도로 준비하는 직업공통능력 인증 학습 앱.",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
