"use client";

/**
 * @file components/tour-detail/detail-map-client.tsx
 * @description 관광지 상세페이지 지도 클라이언트 컴포넌트
 *
 * 주요 기능:
 * 1. Naver Maps API를 사용한 단일 관광지 지도 표시
 * 2. 마커 1개 표시
 * 3. 길찾기 버튼 (네이버 지도 웹/앱 연동)
 * 4. 좌표 정보 표시 (선택 사항)
 *
 * @dependencies
 * - Naver Maps API v3 (스크립트 로드 필요)
 * - lib/utils/coordinate.ts: convertKATECToWGS84
 */

import { useEffect, useRef, useState } from "react";
import { convertKATECToWGS84 } from "@/lib/utils/coordinate";
import { Navigation, MapPin, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error";

interface DetailMapClientProps {
  title: string;
  address?: string; // 주소 정보 (향후 사용 가능)
  mapx: string; // KATEC 좌표
  mapy: string; // KATEC 좌표
}

// Naver Maps API 타입 선언 (전역 naver 객체)
declare global {
  interface Window {
    naver?: {
      maps: {
        Map: new (
          container: HTMLElement,
          options: {
            center: { lat: number; lng: number };
            zoom: number;
            mapTypeControl?: boolean;
            mapTypeControlOptions?: any;
          }
        ) => {
          setCenter: (center: { lat: number; lng: number }) => void;
          setZoom: (zoom: number) => void;
        };
        Marker: new (options: {
          position: any;
          map: any;
          title?: string;
          icon?: any;
        }) => {
          setMap: (map: any) => void;
        };
        LatLng: new (lat: number, lng: number) => {
          lat: () => number;
          lng: () => number;
        };
        Position?: {
          TOP_RIGHT: number;
        };
      };
    };
  }
}

/**
 * 지도 클라이언트 컴포넌트
 */
export function DetailMapClient({
  title,
  mapx,
  mapy,
}: DetailMapClientProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // 좌표 변환
  useEffect(() => {
    try {
      const coords = convertKATECToWGS84(mapx, mapy);
      setCoordinates(coords);
    } catch (err) {
      console.error("좌표 변환 실패:", err);
      setError(
        "좌표 정보를 처리할 수 없습니다. 관리자에게 문의해주세요."
      );
    }
  }, [mapx, mapy]);

  // Naver Maps API 로드 확인
  useEffect(() => {
    const checkNaverMaps = () => {
      if (typeof window !== "undefined" && window.naver?.maps) {
        setIsLoaded(true);
        setError(null);
      }
    };

    // 환경변수 확인
    const ncpKeyId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    if (!ncpKeyId) {
      setError(
        "네이버 지도 API 키가 설정되지 않았습니다. 관리자에게 문의해주세요."
      );
      return;
    }

    checkNaverMaps();
    const interval = setInterval(checkNaverMaps, 100);

    // 5초 후에도 로드되지 않으면 에러 표시
    const timeout = setTimeout(() => {
      if (!window.naver?.maps) {
        setError(
          "네이버 지도를 불러올 수 없습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요."
        );
        clearInterval(interval);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // 지도 초기화 및 마커 표시
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !coordinates) return;

    try {
      const { naver } = window;
      if (!naver?.maps) return;

      // 지도 생성
      const map = new naver.maps.Map(mapRef.current, {
        center: { lat: coordinates.lat, lng: coordinates.lng },
        zoom: 16, // 단일 관광지이므로 줌 레벨을 높게 설정
        mapTypeControl: true,
        mapTypeControlOptions: {
          position:
            naver.maps.Position?.TOP_RIGHT !== undefined
              ? naver.maps.Position.TOP_RIGHT
              : 1,
        },
      });

      mapInstanceRef.current = map;

      // 마커 생성
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(coordinates.lat, coordinates.lng),
        map,
        title,
      });

      markerRef.current = marker;
    } catch (err) {
      console.error("지도 초기화 실패:", err);
      setError(
        "지도를 초기화할 수 없습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요."
      );
    }
  }, [isLoaded, coordinates, title]);

  // 길찾기 버튼 클릭 핸들러
  const handleDirections = () => {
    if (!coordinates) return;

    // 네이버 지도 웹 URL
    const naverMapUrl = `https://map.naver.com/v5/directions/${coordinates.lat},${coordinates.lng},,PLACE_POI`;
    window.open(naverMapUrl, "_blank", "noopener,noreferrer");
  };

  // 좌표 복사 핸들러
  const handleCopyCoordinates = async () => {
    if (!coordinates) return;

    const coordText = `${coordinates.lat}, ${coordinates.lng}`;
    try {
      await navigator.clipboard.writeText(coordText);
      // 복사 완료 피드백은 사용자가 버튼 클릭 시 자동으로 알 수 있도록 간단하게 처리
      // 필요시 toast 메시지 추가 가능
    } catch (err) {
      console.error("좌표 복사 실패:", err);
    }
  };

  // 에러 상태
  if (error) {
    return (
      <div className="w-full">
        <ErrorMessage
          title="지도를 불러올 수 없습니다"
          message={error}
          type="api"
        />
      </div>
    );
  }

  // 좌표 변환 중
  if (!coordinates) {
    return (
      <div className="w-full h-[300px] md:h-[400px] bg-muted animate-pulse rounded-lg" />
    );
  }

  return (
    <div className="space-y-4">
      {/* 지도 컨테이너 */}
      <div
        ref={mapRef}
        className="w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden border bg-muted"
        aria-label="관광지 위치 지도"
      />

      {/* 버튼 영역 */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* 길찾기 버튼 */}
        <Button
          onClick={handleDirections}
          className="flex-1"
          aria-label="네이버 지도에서 길찾기"
        >
          <Navigation className="w-4 h-4 mr-2" aria-hidden="true" />
          길찾기
        </Button>

        {/* 좌표 정보 표시/숨김 토글 */}
        <Button
          onClick={() => setShowCoordinates(!showCoordinates)}
          variant="outline"
          className="flex-1"
          aria-label={showCoordinates ? "좌표 정보 숨기기" : "좌표 정보 보기"}
        >
          <MapPin className="w-4 h-4 mr-2" aria-hidden="true" />
          좌표 정보
        </Button>
      </div>

      {/* 좌표 정보 표시 영역 */}
      {showCoordinates && (
        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              위치 좌표
            </p>
            <p className="text-sm font-mono">
              위도: {coordinates.lat.toFixed(6)}, 경도:{" "}
              {coordinates.lng.toFixed(6)}
            </p>
          </div>
          <Button
            onClick={handleCopyCoordinates}
            variant="ghost"
            size="sm"
            className="ml-2"
            aria-label="좌표 복사"
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
}

