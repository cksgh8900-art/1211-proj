"use client";

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, User } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
        {/* 로고 */}
        <Link href="/" className="text-2xl font-bold">
          My Trip
        </Link>

        {/* 데스크톱 네비게이션 */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            홈
          </Link>
          <Link
            href="/stats"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            통계
          </Link>
          <SignedIn>
            <Link
              href="/bookmarks"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              북마크
            </Link>
          </SignedIn>
        </div>

        {/* 데스크톱 검색창 */}
        <div className="hidden lg:flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="search"
              placeholder="관광지 검색..."
              className="pl-10 w-full"
              disabled
              aria-label="관광지 검색"
            />
          </div>
        </div>

        {/* 모바일 검색 아이콘 및 햄버거 메뉴 */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="검색"
          >
            <Search className="w-5 h-5" />
          </Button>
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
        <div className="flex items-center gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="hidden sm:inline-flex">로그인</Button>
              <Button variant="ghost" size="icon" className="sm:hidden" aria-label="로그인">
                <User className="w-5 h-5" />
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

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
