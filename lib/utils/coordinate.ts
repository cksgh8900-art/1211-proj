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
 * KATEC 좌표계를 WGS84 좌표계로 변환
 *
 * 한국관광공사 API는 KATEC 좌표계를 사용하며, 정수형으로 저장됩니다.
 * 이를 WGS84 좌표계로 변환하려면 10000000으로 나누어야 합니다.
 *
 * @param mapx - 경도 (KATEC 좌표계, 정수형 문자열)
 * @param mapy - 위도 (KATEC 좌표계, 정수형 문자열)
 * @returns WGS84 좌표계의 위도(lat)와 경도(lng)
 *
 * @example
 * ```typescript
 * const { lat, lng } = convertKATECToWGS84("1270000000", "375000000");
 * // { lat: 37.5, lng: 127.0 }
 * ```
 */
export function convertKATECToWGS84(
  mapx: string,
  mapy: string
): { lat: number; lng: number } {
  // 문자열을 숫자로 변환 후 10000000으로 나누기
  const lng = Number.parseInt(mapx, 10) / 10000000;
  const lat = Number.parseInt(mapy, 10) / 10000000;

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

