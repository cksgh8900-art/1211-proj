/**
 * @file app/places/[contentId]/page.tsx
 * @description 관광지 상세페이지
 *
 * 주요 기능:
 * 1. 동적 라우팅으로 관광지 상세 정보 표시
 * 2. 뒤로가기 버튼
 * 3. 기본 레이아웃 구조 (추후 섹션 추가 예정)
 *
 * URL 구조:
 * - /places/[contentId] (예: /places/125266)
 *
 * @dependencies
 * - components/tour-detail/back-button.tsx: BackButton 컴포넌트
 * - components/ui/error.tsx: ErrorMessage 컴포넌트
 * - next/navigation: notFound
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BackButton } from "@/components/tour-detail/back-button";
import { DetailInfo } from "@/components/tour-detail/detail-info";
import { DetailInfoSkeleton } from "@/components/tour-detail/detail-info-skeleton";

interface PageProps {
  params: Promise<{ contentId: string }>;
}

/**
 * contentId 검증 함수
 */
function isValidContentId(contentId: string): boolean {
  // contentId는 숫자 문자열이어야 함
  return /^\d+$/.test(contentId);
}

/**
 * 상세페이지 메인 컴포넌트 (Server Component)
 */
export default async function TourDetailPage({ params }: PageProps) {
  // Next.js 15에서 params는 Promise입니다
  const { contentId } = await params;

  // contentId 검증
  if (!isValidContentId(contentId)) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
      {/* 뒤로가기 버튼 */}
      <BackButton />

      {/* 메인 콘텐츠 영역 */}
      <div className="space-y-6 mt-6">
        {/* 기본 정보 섹션 */}
        <Suspense fallback={<DetailInfoSkeleton />}>
          <DetailInfo contentId={contentId} />
        </Suspense>

        {/* TODO: 추후 섹션 컴포넌트들 추가 예정
          - 운영 정보 섹션 (detail-intro.tsx)
          - 이미지 갤러리 (detail-gallery.tsx)
          - 지도 섹션 (detail-map.tsx)
          - 반려동물 정보 섹션 (detail-pet-tour.tsx)
        */}
      </div>
    </div>
  );
}

