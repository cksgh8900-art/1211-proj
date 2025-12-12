/**
 * @file lib/utils/coordinate.ts
 * @description 좌표 변환 유틸리티 함수
 *
 * 주요 기능:
 * - KATEC 좌표계를 WGS84 좌표계로 변환
 * - 한국관광공사 API에서 제공하는 좌표 (mapx, mapy)를 네이버 지도에서 사용 가능한 좌표로 변환
 *
 * 참고:
 * - PRD.md 2.2: 좌표 변환 (KATEC → WGS84: mapx/mapy / 10000000)
 * - mapx: 경도 (longitude), mapy: 위도 (latitude)
 */

/**
 * 한국관광공사 API 좌표를 WGS84 좌표계로 변환
 *
 * 한국관광공사 API(KorService2)는 두 가지 형식으로 좌표를 반환할 수 있습니다:
 * 1. 소수점 형식 (예: "126.9846616856") - 이미 WGS84 좌표계
 * 2. 정수 형식 (예: "1269846616") - KATEC 좌표계, 10000000으로 나누어야 함
 *
 * 이 함수는 두 가지 형식을 자동으로 감지하여 처리합니다.
 *
 * @param mapx - 경도 (문자열)
 * @param mapy - 위도 (문자열)
 * @returns WGS84 좌표계의 위도(lat)와 경도(lng)
 *
 * @example
 * ```typescript
 * // 소수점 형식 (이미 WGS84)
 * const { lat, lng } = convertKATECToWGS84("126.9846616856", "37.5820858828");
 * // { lat: 37.5820858828, lng: 126.9846616856 }
 *
 * // 정수 형식 (KATEC → WGS84 변환 필요)
 * const { lat, lng } = convertKATECToWGS84("1270000000", "375000000");
 * // { lat: 37.5, lng: 127.0 }
 * ```
 */
export function convertKATECToWGS84(
  mapx: string,
  mapy: string
): { lat: number; lng: number } {
  // 소수점 여부 확인하여 형식 판단
  const hasDecimalX = mapx.includes(".");
  const hasDecimalY = mapy.includes(".");

  let lng: number;
  let lat: number;

  if (hasDecimalX && hasDecimalY) {
    // 소수점 형식: 이미 WGS84 좌표계이므로 그대로 파싱
    lng = Number.parseFloat(mapx);
    lat = Number.parseFloat(mapy);
  } else {
    // 정수 형식: KATEC 좌표계이므로 10000000으로 나누기
    lng = Number.parseInt(mapx, 10) / 10000000;
    lat = Number.parseInt(mapy, 10) / 10000000;
  }

  // 유효성 검사
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    throw new Error(
      `Invalid coordinates: mapx=${mapx}, mapy=${mapy}. Expected numeric strings.`
    );
  }

  // 좌표 범위 검사 (대략적인 범위)
  if (lat < 33 || lat > 43 || lng < 124 || lng > 132) {
    console.warn(
      `Coordinates out of expected range for South Korea: lat=${lat}, lng=${lng}`
    );
  }

  return { lat, lng };
}

/**
 * 여러 관광지의 중심 좌표를 계산
 *
 * 모든 관광지의 경계 박스를 계산하여 중심 좌표를 반환합니다.
 *
 * @param tours - 관광지 목록 (mapx, mapy 속성 필요)
 * @returns 중심 좌표와 경계 박스, 또는 null (관광지가 없을 때)
 */
export function calculateCenter(
  tours: Array<{ mapx: string; mapy: string }>
): { lat: number; lng: number } | null {
  if (tours.length === 0) {
    return null;
  }

  try {
    const coordinates = tours
      .map((tour) => {
        try {
          return convertKATECToWGS84(tour.mapx, tour.mapy);
        } catch {
          return null;
        }
      })
      .filter(
        (coord): coord is { lat: number; lng: number } => coord !== null
      );

    if (coordinates.length === 0) {
      return null;
    }

    // 경계 박스 계산
    const lats = coordinates.map((c) => c.lat);
    const lngs = coordinates.map((c) => c.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // 중심 좌표 반환
    return {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2,
    };
  } catch (error) {
    console.error("Failed to calculate center coordinates:", error);
    return null;
  }
}

/**
 * 경계 박스로부터 적절한 줌 레벨을 추정
 *
 * 주의: 이는 근사치이며, 실제로는 Naver Maps API의 `fitBounds` 메서드를 사용하는 것이 더 정확합니다.
 *
 * @param bounds - 경계 박스
 * @returns 추정된 줌 레벨 (1-21)
 */
export function estimateZoomLevel(bounds: {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}): number {
  const latDiff = bounds.maxLat - bounds.minLat;
  const lngDiff = bounds.maxLng - bounds.minLng;
  const maxDiff = Math.max(latDiff, lngDiff);

  // 대략적인 줌 레벨 계산
  if (maxDiff > 5) return 7;
  if (maxDiff > 2) return 8;
  if (maxDiff > 1) return 9;
  if (maxDiff > 0.5) return 10;
  if (maxDiff > 0.2) return 11;
  if (maxDiff > 0.1) return 12;
  if (maxDiff > 0.05) return 13;
  if (maxDiff > 0.02) return 14;
  if (maxDiff > 0.01) return 15;
  return 16;
}

