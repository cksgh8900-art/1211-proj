/**
 * @file app/page.tsx
 * @description My Trip 홈페이지 - 관광지 목록 및 지도 표시
 *
 * 주요 기능:
 * 1. 관광지 목록 표시
 * 2. 필터 및 정렬 기능
 * 3. 네이버 지도 연동
 * 4. 검색 기능
 *
 * 레이아웃 구조:
 * - Hero Section (데스크톱만, 선택 사항)
 * - Filters & Controls (Sticky)
 * - List/Map 영역 (데스크톱: 2컬럼, 모바일: 탭)
 *
 * @dependencies
 * - components/tour-list.tsx (Phase 2.2)
 * - components/tour-filters.tsx (Phase 2.3)
 * - components/tour-search.tsx (Phase 2.4)
 * - components/naver-map.tsx (Phase 2.5)
 */

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section (선택 사항, 데스크톱만) */}
      <section className="hidden lg:block py-12 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            한국의 아름다운 관광지를 탐험하세요
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            전국 관광지 정보를 한눈에 보고 지도에서 확인하세요
          </p>
          {/* Phase 2.4에서 검색창 컴포넌트 추가 예정 */}
        </div>
      </section>

      {/* Filters & Controls (Sticky) */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          {/* Phase 2.3에서 필터 컴포넌트 추가 예정 */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            필터 및 정렬 컨트롤이 여기에 표시됩니다
          </div>
        </div>
      </section>

      {/* List/Map 영역 */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* 좌측: List View */}
          <div className="list-view">
            {/* Phase 2.2에서 tour-list 컴포넌트 추가 예정 */}
            <div className="flex items-center justify-center h-96 rounded-lg border-2 border-dashed text-muted-foreground">
              관광지 목록이 여기에 표시됩니다
            </div>
          </div>

          {/* 우측: Map View (데스크톱만) */}
          <div className="hidden lg:block map-view">
            {/* Phase 2.5에서 naver-map 컴포넌트 추가 예정 */}
            <div className="flex items-center justify-center h-96 rounded-lg border-2 border-dashed text-muted-foreground">
              지도가 여기에 표시됩니다
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
