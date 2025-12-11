/**
 * @file 한국관광공사 API 클라이언트
 * @description Server Component용 관광공사 API 호출 함수들
 * 
 * PRD.md 4장 API 명세 기반으로 작성
 * Base URL: https://apis.data.go.kr/B551011/KorService2
 * 
 * 모든 함수는 Server Component에서만 사용 가능 (async 함수)
 */

import type {
  AreaCode,
  TourItem,
  TourDetail,
  TourIntro,
  TourImage,
  PetTourInfo,
  TourApiResponse,
  TourApiErrorResponse,
  AreaCodeParams,
  AreaBasedListParams,
  SearchKeywordParams,
  DetailCommonParams,
  DetailIntroParams,
  DetailImageParams,
  DetailPetTourParams,
} from "@/lib/types/tour";

/**
 * API Base URL
 */
const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

/**
 * API 타임아웃 (밀리초)
 */
const API_TIMEOUT = 10000; // 10초

/**
 * 최대 재시도 횟수
 */
const MAX_RETRIES = 3;

/**
 * 재시도 지연 시간 기본값 (밀리초)
 */
const RETRY_DELAY = 1000; // 1초

/**
 * 한국관광공사 API 에러 타입
 */
export class TourApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "TourApiError";
  }
}

/**
 * 공통 파라미터 생성 함수
 */
function getCommonParams() {
  const serviceKey = process.env.NEXT_PUBLIC_TOUR_API_KEY;

  if (!serviceKey) {
    throw new TourApiError(
      "NEXT_PUBLIC_TOUR_API_KEY 환경변수가 설정되지 않았습니다."
    );
  }

  return {
    serviceKey,
    MobileOS: "ETC",
    MobileApp: "MyTrip",
    _type: "json",
  };
}

/**
 * 지수 백오프를 사용한 재시도 지연 시간 계산
 */
function getRetryDelay(attempt: number): number {
  return RETRY_DELAY * Math.pow(2, attempt - 1);
}

/**
 * 타임아웃을 적용한 fetch 래퍼
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new TourApiError("API 요청 시간 초과", undefined, 408);
    }
    throw error;
  }
}

/**
 * 재시도 로직이 포함된 API 호출 함수
 */
async function callApiWithRetry<T>(
  endpoint: string,
  params: Record<string, string | number | undefined>,
  retries: number = MAX_RETRIES
): Promise<T> {
  const commonParams = getCommonParams();
  const queryParams = new URLSearchParams({
    ...commonParams,
    ...Object.fromEntries(
      Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ),
  });

  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        throw new TourApiError(
          `API 요청 실패: ${response.statusText}`,
          undefined,
          response.status
        );
      }

      const data: TourApiResponse<T> | TourApiErrorResponse =
        await response.json();

      // API 응답 에러 체크
      if (data.response.header.resultCode !== "0000") {
        const errorMsg = data.response.header.resultMsg || "알 수 없는 오류";
        throw new TourApiError(
          `API 오류: ${errorMsg}`,
          data.response.header.resultCode
        );
      }

      // 응답이 TourApiResponse인 경우 items 추출
      if ("body" in data && data.response.body?.items) {
        const responseData = data as TourApiResponse<T>;
        const items = responseData.response.body.items!.item;
        // 단일 항목인 경우 배열로 변환
        return (Array.isArray(items) ? items : [items]) as unknown as T;
      }

      throw new TourApiError("API 응답 형식이 올바르지 않습니다.");
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // 마지막 시도가 아니고, 재시도 가능한 에러인 경우
      if (attempt < retries) {
        // 네트워크 에러나 타임아웃 에러만 재시도
        if (
          lastError instanceof TourApiError &&
          (lastError.statusCode === 408 ||
            lastError.message.includes("시간 초과") ||
            lastError.message.includes("네트워크"))
        ) {
          const delay = getRetryDelay(attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        // API 응답 에러(예: 잘못된 파라미터)는 재시도하지 않음
        break;
      }
    }
  }

  // 모든 재시도 실패
  throw lastError || new TourApiError("API 요청 실패");
}

/**
 * 지역코드 조회 (areaCode2)
 * 
 * @param params - 지역코드 조회 파라미터
 * @returns 지역코드 목록
 */
export async function getAreaCode(
  params: AreaCodeParams = {}
): Promise<AreaCode[]> {
  const result = await callApiWithRetry<AreaCode>("/areaCode2", {
    areaCode: params.areaCode,
    numOfRows: params.numOfRows || 100,
    pageNo: params.pageNo || 1,
  });

  return Array.isArray(result) ? result : [result];
}

/**
 * 지역 기반 관광정보 목록 조회 (areaBasedList2)
 * 
 * @param params - 지역 기반 목록 조회 파라미터
 * @returns 관광지 목록
 */
export async function getAreaBasedList(
  params: AreaBasedListParams
): Promise<TourItem[]> {
  const result = await callApiWithRetry<TourItem>("/areaBasedList2", {
    areaCode: params.areaCode,
    contentTypeId: params.contentTypeId,
    sigunguCode: params.sigunguCode,
    cat1: params.cat1,
    cat2: params.cat2,
    cat3: params.cat3,
    numOfRows: params.numOfRows || 10,
    pageNo: params.pageNo || 1,
  });

  return Array.isArray(result) ? result : [result];
}

/**
 * 키워드 검색 (searchKeyword2)
 * 
 * @param params - 키워드 검색 파라미터
 * @returns 검색된 관광지 목록
 */
export async function searchKeyword(
  params: SearchKeywordParams
): Promise<TourItem[]> {
  const result = await callApiWithRetry<TourItem>("/searchKeyword2", {
    keyword: params.keyword,
    areaCode: params.areaCode,
    contentTypeId: params.contentTypeId,
    numOfRows: params.numOfRows || 10,
    pageNo: params.pageNo || 1,
  });

  return Array.isArray(result) ? result : [result];
}

/**
 * 공통 정보 조회 (detailCommon2)
 * 
 * @param params - 공통 정보 조회 파라미터
 * @returns 관광지 상세 정보
 */
export async function getDetailCommon(
  params: DetailCommonParams
): Promise<TourDetail> {
  const result = await callApiWithRetry<TourDetail>("/detailCommon2", {
    contentId: params.contentId,
    defaultYN: params.defaultYN || "Y",
    firstImageYN: params.firstImageYN || "Y",
    addrinfoYN: params.addrinfoYN || "Y",
    mapinfoYN: params.mapinfoYN || "Y",
    overviewYN: params.overviewYN || "Y",
  });

  // 단일 항목 반환
  const items = Array.isArray(result) ? result : [result];
  if (items.length === 0) {
    throw new TourApiError(
      `관광지 정보를 찾을 수 없습니다. (contentId: ${params.contentId})`
    );
  }

  return items[0];
}

/**
 * 소개 정보 조회 (detailIntro2)
 * 
 * @param params - 소개 정보 조회 파라미터
 * @returns 관광지 운영 정보
 */
export async function getDetailIntro(
  params: DetailIntroParams
): Promise<TourIntro> {
  const result = await callApiWithRetry<TourIntro>("/detailIntro2", {
    contentId: params.contentId,
    contentTypeId: params.contentTypeId,
  });

  // 단일 항목 반환
  const items = Array.isArray(result) ? result : [result];
  if (items.length === 0) {
    throw new TourApiError(
      `운영 정보를 찾을 수 없습니다. (contentId: ${params.contentId})`
    );
  }

  return items[0];
}

/**
 * 이미지 목록 조회 (detailImage2)
 * 
 * @param params - 이미지 목록 조회 파라미터
 * @returns 관광지 이미지 목록
 */
export async function getDetailImage(
  params: DetailImageParams
): Promise<TourImage[]> {
  const result = await callApiWithRetry<TourImage>("/detailImage2", {
    contentId: params.contentId,
    imageYN: params.imageYN || "Y",
    subImageYN: params.subImageYN || "Y",
  });

  return Array.isArray(result) ? result : [result];
}

/**
 * 반려동물 정보 조회 (detailPetTour2)
 * 
 * @param params - 반려동물 정보 조회 파라미터
 * @returns 반려동물 동반 여행 정보
 */
export async function getDetailPetTour(
  params: DetailPetTourParams
): Promise<PetTourInfo | null> {
  try {
    const result = await callApiWithRetry<PetTourInfo>("/detailPetTour2", {
      contentId: params.contentId,
    });

    const items = Array.isArray(result) ? result : [result];
    return items.length > 0 ? items[0] : null;
  } catch (error) {
    // 반려동물 정보가 없는 경우 null 반환 (에러가 아닌 경우로 처리)
    if (
      error instanceof TourApiError &&
      (error.code === "SERVICE_ERROR" || error.message.includes("없습니다"))
    ) {
      return null;
    }
    throw error;
  }
}

