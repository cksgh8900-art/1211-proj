/**
 * @file components/tour-detail/detail-map.tsx
 * @description 관광지 상세페이지 지도 섹션 (Server Component)
 *
 * 주요 기능:
 * 1. 관광지 상세 정보 조회 (getDetailCommon)
 * 2. 좌표 정보 추출 및 검증
 * 3. Client Component에 데이터 전달
 *
 * @dependencies
 * - lib/api/tour-api.ts: getDetailCommon
 * - lib/types/tour.ts: TourDetail
 * - components/tour-detail/detail-map-client.tsx: DetailMapClient
 */

import { getDetailCommon } from "@/lib/api/tour-api";
import type { TourDetail } from "@/lib/types/tour";
import { ErrorMessage } from "@/components/ui/error";
import { DetailMapClient } from "./detail-map-client";

interface DetailMapProps {
  contentId: string;
}

/**
 * 지도 섹션 컴포넌트 (Server Component)
 */
export async function DetailMap({ contentId }: DetailMapProps) {
  try {
    // 관광지 상세 정보 조회
    const detail: TourDetail = await getDetailCommon({ contentId });

    // 좌표 정보 검증
    if (!detail.mapx || !detail.mapy) {
      // 좌표가 없으면 섹션 숨김
      return null;
    }

    // 주소 정보 추출
    const address = detail.addr2
      ? `${detail.addr1} ${detail.addr2}`
      : detail.addr1;

    return (
      <section
        className="rounded-lg border bg-card p-6 space-y-4"
        aria-label="지도"
      >
        <h2 className="text-2xl font-bold mb-4">지도</h2>
        <DetailMapClient
          title={detail.title}
          address={address}
          mapx={detail.mapx}
          mapy={detail.mapy}
        />
      </section>
    );
  } catch (error) {
    console.error("관광지 지도 로드 실패:", error);
    return (
      <section className="rounded-lg border bg-card p-6">
        <ErrorMessage
          title="지도를 불러올 수 없습니다"
          message={
            error instanceof Error
              ? error.message
              : "관광지 지도 정보를 불러오는 중 오류가 발생했습니다."
          }
          type="api"
        />
      </section>
    );
  }
}

