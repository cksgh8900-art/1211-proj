/**
 * @file components/tour-detail/detail-info.tsx
 * @description 관광지 기본 정보 섹션 컴포넌트
 *
 * 주요 기능:
 * 1. detailCommon2 API를 통한 기본 정보 표시
 * 2. 관광지명, 이미지, 주소, 전화번호, 홈페이지, 개요, 타입/카테고리 표시
 * 3. 주소 복사 기능
 * 4. 전화번호 클릭 시 전화 연결
 * 5. 정보 없는 항목 숨김 처리
 *
 * @dependencies
 * - lib/api/tour-api.ts: getDetailCommon
 * - lib/types/tour.ts: TourDetail
 * - lib/types/stats.ts: CONTENT_TYPE_NAME, AREA_CODE_NAME
 * - components/tour-detail/copy-address-button.tsx: CopyAddressButton
 * - next/image: Image
 * - lucide-react: Phone, ExternalLink, MapPin
 */

import Image from "next/image";
import { Phone, ExternalLink, MapPin } from "lucide-react";
import { getDetailCommon } from "@/lib/api/tour-api";
import type { TourDetail } from "@/lib/types/tour";
import { CONTENT_TYPE_NAME, AREA_CODE_NAME } from "@/lib/types/stats";
import { CopyAddressButton } from "./copy-address-button";
import { ErrorMessage } from "@/components/ui/error";
import { getBlurDataURL } from "@/lib/utils/image";

interface DetailInfoProps {
  contentId: string;
}

/**
 * 이미지 URL을 반환 (우선순위: firstimage > firstimage2 > 기본 이미지)
 */
function getImageUrl(detail: TourDetail): string | null {
  if (detail.firstimage) return detail.firstimage;
  if (detail.firstimage2) return detail.firstimage2;
  return null;
}

/**
 * 관광 타입명을 반환
 */
function getContentTypeName(contentTypeId: string): string {
  return CONTENT_TYPE_NAME[contentTypeId] || "기타";
}

/**
 * 지역명을 반환
 */
function getAreaName(areaCode: string): string {
  return AREA_CODE_NAME[areaCode] || "";
}

/**
 * 전체 주소를 반환 (addr1 + addr2)
 */
function getFullAddress(detail: TourDetail): string {
  if (detail.addr2) {
    return `${detail.addr1} ${detail.addr2}`;
  }
  return detail.addr1;
}

/**
 * 홈페이지 URL을 정규화 (http:// 또는 https:// 추가)
 */
function formatHomepageUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * 개요 텍스트에서 HTML 태그 제거 및 줄바꿈 처리
 */
function formatOverview(overview: string | undefined): string {
  if (!overview) return "";
  // HTML 태그 제거
  const text = overview.replace(/<[^>]*>/g, "");
  return text;
}

/**
 * 기본 정보 섹션 컴포넌트 (Server Component)
 */
export async function DetailInfo({ contentId }: DetailInfoProps) {
  try {
    const detail = await getDetailCommon({ contentId });

    const imageUrl = getImageUrl(detail);
    const contentTypeName = getContentTypeName(detail.contenttypeid);
    const areaName = getAreaName(detail.areacode);
    const fullAddress = getFullAddress(detail);
    const homepageUrl = detail.homepage
      ? formatHomepageUrl(detail.homepage)
      : null;
    const overview = formatOverview(detail.overview);

    return (
      <section
        className="rounded-lg border bg-card p-6 space-y-6"
        aria-label="관광지 기본 정보"
      >
        {/* 제목 및 뱃지 */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold">{detail.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {contentTypeName}
            </span>
            {areaName && (
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {areaName}
              </span>
            )}
            {detail.cat1name && (
              <span className="text-sm text-muted-foreground">
                {detail.cat1name}
                {detail.cat2name && ` > ${detail.cat2name}`}
                {detail.cat3name && ` > ${detail.cat3name}`}
              </span>
            )}
          </div>
        </div>

        {/* 대표 이미지 */}
        {imageUrl && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={detail.title}
              fill
              className="object-cover"
              priority
              loading="eager"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 80vw"
              placeholder="blur"
              blurDataURL={getBlurDataURL()}
            />
          </div>
        )}

        {/* 기본 정보 */}
        <div className="space-y-4">
          {/* 주소 */}
          {fullAddress && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <h2 className="text-lg font-semibold">주소</h2>
              </div>
              <p className="text-muted-foreground pl-7">{fullAddress}</p>
              <div className="pl-7">
                <CopyAddressButton address={fullAddress} />
              </div>
            </div>
          )}

          {/* 전화번호 */}
          {detail.tel && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <h2 className="text-lg font-semibold">전화번호</h2>
              </div>
              <a
                href={`tel:${detail.tel}`}
                className="text-primary hover:underline pl-7 inline-flex items-center gap-2"
                aria-label={`${detail.tel}로 전화하기`}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {detail.tel}
              </a>
            </div>
          )}

          {/* 홈페이지 */}
          {homepageUrl && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <h2 className="text-lg font-semibold">홈페이지</h2>
              </div>
              <a
                href={homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline pl-7 inline-flex items-center gap-2 break-all"
                aria-label="홈페이지 열기 (새 탭)"
              >
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{homepageUrl}</span>
              </a>
            </div>
          )}

          {/* 개요 */}
          {overview && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">개요</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {overview}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.error("관광지 기본 정보 로드 실패:", error);
    return (
      <section className="rounded-lg border bg-card p-6">
        <ErrorMessage
          title="정보를 불러올 수 없습니다"
          message={
            error instanceof Error
              ? error.message
              : "관광지 기본 정보를 불러오는 중 오류가 발생했습니다."
          }
          type="api"
        />
      </section>
    );
  }
}

