/**
 * @file app/places/[contentId]/page.tsx
 * @description 관광지 상세페이지
 *
 * 주요 기능:
 * 1. 동적 라우팅으로 관광지 상세 정보 표시
 * 2. 뒤로가기 버튼
 * 3. 기본 레이아웃 구조 (추후 섹션 추가 예정)
 * 4. 동적 메타데이터 생성 (Open Graph)
 *
 * URL 구조:
 * - /places/[contentId] (예: /places/125266)
 *
 * @dependencies
 * - components/tour-detail/back-button.tsx: BackButton 컴포넌트
 * - components/ui/error.tsx: ErrorMessage 컴포넌트
 * - next/navigation: notFound
 * - lib/api/tour-api.ts: getDetailCommon
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDetailCommon } from "@/lib/api/tour-api";
import { BackButton } from "@/components/tour-detail/back-button";
import { DetailInfo } from "@/components/tour-detail/detail-info";
import { DetailInfoSkeleton } from "@/components/tour-detail/detail-info-skeleton";
import { DetailIntro } from "@/components/tour-detail/detail-intro";
import { DetailIntroSkeleton } from "@/components/tour-detail/detail-intro-skeleton";
import { DetailGallery } from "@/components/tour-detail/detail-gallery";
import { DetailGallerySkeleton } from "@/components/tour-detail/detail-gallery-skeleton";
import { DetailMap } from "@/components/tour-detail/detail-map";
import { DetailMapSkeleton } from "@/components/tour-detail/detail-map-skeleton";
import { DetailPetTour } from "@/components/tour-detail/detail-pet-tour";
import { DetailPetTourSkeleton } from "@/components/tour-detail/detail-pet-tour-skeleton";
import { ShareButton } from "@/components/tour-detail/share-button";
import { BookmarkButton } from "@/components/bookmarks/bookmark-button";

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
 * HTML 태그 제거 함수
 */
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * 동적 메타데이터 생성 (Open Graph)
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { contentId } = await params;

  // contentId 검증
  if (!isValidContentId(contentId)) {
    return {
      title: "관광지 정보",
      description: "한국 관광지 정보를 확인하세요.",
    };
  }

  try {
    // 관광지 정보 조회
    const detail = await getDetailCommon({ contentId });

    // 기본 정보 추출
    const title = detail.title;
    const description = detail.overview
      ? stripHtmlTags(detail.overview).substring(0, 100) +
        (detail.overview.length > 100 ? "..." : "")
      : `${detail.title} - 한국 관광지 정보`;
    const imageUrl = detail.firstimage || detail.firstimage2 || undefined;

    // URL 생성 (환경변수가 없으면 상대 URL 사용)
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://mytrip.example.com";
    const url = `${baseUrl}/places/${contentId}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        siteName: "My Trip",
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: title,
              },
            ]
          : undefined,
        locale: "ko_KR",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch (error) {
    // 에러 발생 시 기본 메타데이터 반환
    console.error("메타데이터 생성 실패:", error);
    return {
      title: "관광지 정보",
      description: "한국 관광지 정보를 확인하세요.",
    };
  }
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
      {/* 뒤로가기 버튼 및 공유/북마크 버튼 */}
      <div className="flex items-center justify-between">
        <BackButton />
        <div className="flex items-center gap-2">
          <BookmarkButton contentId={contentId} />
          <ShareButton contentId={contentId} />
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="space-y-6 mt-6">
        {/* 기본 정보 섹션 */}
        <Suspense fallback={<DetailInfoSkeleton />}>
          <DetailInfo contentId={contentId} />
        </Suspense>

        {/* 운영 정보 섹션 */}
        <Suspense fallback={<DetailIntroSkeleton />}>
          <DetailIntro contentId={contentId} />
        </Suspense>

        {/* 반려동물 동반 정보 섹션 */}
        <Suspense fallback={<DetailPetTourSkeleton />}>
          <DetailPetTour contentId={contentId} />
        </Suspense>

        {/* 이미지 갤러리 섹션 */}
        <Suspense fallback={<DetailGallerySkeleton />}>
          <DetailGallery contentId={contentId} />
        </Suspense>

        {/* 지도 섹션 */}
        <Suspense fallback={<DetailMapSkeleton />}>
          <DetailMap contentId={contentId} />
        </Suspense>

      </div>
    </div>
  );
}

