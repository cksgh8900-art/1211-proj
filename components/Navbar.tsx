"use client";

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, User } from "lucide-react";
import { TourSearch } from "@/components/tour-search";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex items-center p-4 gap-4 h-16 max-w-7xl mx-auto relative">
        {/* 로고 */}
        <Link href="/" className="text-2xl font-bold flex-shrink-0 z-10">
          My Trip
        </Link>

        {/* 데스크톱 네비게이션 */}
        <div className="hidden md:flex items-center gap-6 flex-shrink-0">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap"
          >
            홈
          </Link>
          <Link
            href="/stats"
            className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap"
          >
            통계
          </Link>
          <SignedIn>
            <Link
              href="/bookmarks"
              className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap"
            >
              북마크
            </Link>
          </SignedIn>
        </div>

        {/* 데스크톱 검색창 */}
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0 w-[350px]">
          <TourSearch variant="compact" />
        </div>

        {/* 모바일 검색 아이콘 및 햄버거 메뉴 */}
        <div className="flex lg:hidden items-center gap-2 flex-shrink-0 ml-auto">
          {!mobileSearchOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="검색"
            >
              <Search className="w-5 h-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="메뉴"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* 로그인 버튼 / UserButton */}
        <div className="flex items-center gap-2 flex-shrink-0 z-10">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="icon" className="sm:size-auto sm:px-4" aria-label="로그인">
                <User className="w-5 h-5 sm:hidden" />
                <span className="hidden sm:inline">로그인</span>
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

      {/* 모바일 검색창 */}
      {mobileSearchOpen && (
        <div className="lg:hidden border-t bg-background p-4">
          <TourSearch
            variant="default"
            className="w-full"
            placeholder="관광지 검색..."
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileSearchOpen(false)}
            className="mt-2 w-full"
          >
            닫기
          </Button>
        </div>
      )}

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="flex flex-col p-4 gap-4 max-w-7xl mx-auto">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              홈
            </Link>
            <Link
              href="/stats"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              통계
            </Link>
            <SignedIn>
              <Link
                href="/bookmarks"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                북마크
              </Link>
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
