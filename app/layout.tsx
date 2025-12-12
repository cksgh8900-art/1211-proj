import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import { customKoKR } from "@/lib/clerk/localization";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // 폰트 로딩 최적화
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // 폰트 로딩 최적화
});

export const metadata: Metadata = {
  title: {
    default: "My Trip - 한국 관광지 정보 서비스",
    template: "%s | My Trip",
  },
  description:
    "전국 관광지 정보를 쉽게 검색하고 지도에서 확인하며 상세 정보를 조회할 수 있는 웹 서비스",
  keywords: [
    "관광",
    "여행",
    "한국",
    "관광지",
    "여행지",
    "한국 여행",
    "관광 정보",
    "지도",
    "검색",
  ],
  openGraph: {
    title: "My Trip - 한국 관광지 정보 서비스",
    description:
      "전국 관광지 정보를 쉽게 검색하고 지도에서 확인하며 상세 정보를 조회할 수 있는 웹 서비스",
    type: "website",
    locale: "ko_KR",
    siteName: "My Trip",
    images: [
      {
        url: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://mytrip.example.com"
        }/og-image.png`,
        width: 1200,
        height: 630,
        alt: "My Trip - 한국 관광지 정보 서비스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Trip - 한국 관광지 정보 서비스",
    description:
      "전국 관광지 정보를 쉽게 검색하고 지도에서 확인하며 상세 정보를 조회할 수 있는 웹 서비스",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const naverMapClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  return (
    <ClerkProvider localization={customKoKR}>
      <html lang="ko">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        >
          <SyncUserProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-center" />
          </SyncUserProvider>
          {/* Naver Maps API 스크립트 */}
          {naverMapClientId && (
            <Script
              src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapClientId}`}
              strategy="afterInteractive"
            />
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
