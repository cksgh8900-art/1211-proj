/**
 * @file 통계 관련 TypeScript 타입 정의
 * @description 한국관광공사 API를 활용한 통계 데이터 타입 정의
 * 
 * PRD.md 2.6 통계 대시보드 기반으로 작성
 */

import type { ContentTypeId } from "./tour";

/**
 * 지역별 관광지 통계
 * PRD.md 2.6.1 지역별 관광지 분포 참고
 */
export interface RegionStats {
  areaCode: string; // 지역 코드
  areaName: string; // 지역명 (예: "서울", "부산", "제주")
  count: number; // 관광지 개수
}

/**
 * 관광 타입별 통계
 * PRD.md 2.6.2 관광 타입별 분포 참고
 */
export interface TypeStats {
  contentTypeId: ContentTypeId; // 콘텐츠 타입 ID
  typeName: string; // 타입명 (예: "관광지", "문화시설", "축제/행사")
  count: number; // 관광지 개수
  percentage?: number; // 비율 (백분율, 선택 사항)
}

/**
 * 통계 요약 정보
 * PRD.md 2.6.3 통계 요약 카드 참고
 */
export interface StatsSummary {
  totalCount: number; // 전체 관광지 수
  topRegions: RegionStats[]; // Top 3 지역 (관광지 개수 기준)
  topTypes: TypeStats[]; // Top 3 타입 (관광지 개수 기준)
  lastUpdated: Date; // 마지막 업데이트 시간
}

/**
 * Content Type ID에 대한 타입명 매핑
 * PRD.md 4.4 Content Type ID 참고
 */
export const CONTENT_TYPE_NAME: Record<string, string> = {
  "12": "관광지",
  "14": "문화시설",
  "15": "축제/행사",
  "25": "여행코스",
  "28": "레포츠",
  "32": "숙박",
  "38": "쇼핑",
  "39": "음식점",
} as const;

/**
 * 지역 코드에 대한 지역명 매핑
 * 한국관광공사 API areaCode2 기준
 */
export const AREA_CODE_NAME: Record<string, string> = {
  "1": "서울",
  "2": "인천",
  "3": "대전",
  "4": "대구",
  "5": "광주",
  "6": "부산",
  "7": "울산",
  "8": "세종",
  "31": "경기",
  "32": "강원",
  "33": "충북",
  "34": "충남",
  "35": "경북",
  "36": "경남",
  "37": "전북",
  "38": "전남",
  "39": "제주",
} as const;

