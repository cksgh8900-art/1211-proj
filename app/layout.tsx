import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import { customKoKR } from "@/lib/clerk/localization";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        </body>
      </html>
    </ClerkProvider>
  );
}
