"use server";

/**
 * @file actions/tours.ts
 * @description 관광지 목록 및 검색을 위한 Server Actions
 *
 * 클라이언트 컴포넌트에서 사용할 수 있는 Server Actions
 * 환경변수 보안을 위해 서버 사이드에서만 API 호출 수행
 */

import {
  getAreaBasedList,
  searchKeyword,
} from "@/lib/api/tour-api";
import type {
  TourItem,
  AreaBasedListParams,
  SearchKeywordParams,
} from "@/lib/types/tour";

/**
 * 지역 기반 관광지 목록 조회 (Server Action)
 */
export async function getToursByArea(
  params: AreaBasedListParams
): Promise<{ items: TourItem[]; totalCount: number }> {
  return await getAreaBasedList(params);
}

/**
 * 키워드로 관광지 검색 (Server Action)
 */
export async function searchToursByKeyword(
  params: SearchKeywordParams
): Promise<{ items: TourItem[]; totalCount: number }> {
  return await searchKeyword(params);
}

