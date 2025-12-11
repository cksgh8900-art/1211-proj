export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 데스크톱 레이아웃 */}
        <div className="hidden md:flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            My Trip © {currentYear}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {/* About, Contact 링크는 나중에 추가 가능 */}
            {/* <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </Link> */}
            <span>한국관광공사 API 제공</span>
          </div>
        </div>

        {/* 모바일 레이아웃 */}
        <div className="md:hidden flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <div>My Trip © {currentYear}</div>
          <div className="text-xs">한국관광공사 API 제공</div>
        </div>
      </div>
    </footer>
  );
}

