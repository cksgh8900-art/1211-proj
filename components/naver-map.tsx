"use client";

/**
 * @file components/naver-map.tsx
 * @description 네이버 지도 컴포넌트
 *
 * 주요 기능:
 * 1. Naver Maps API를 사용한 지도 표시
 * 2. 관광지 목록을 마커로 표시
 * 3. 마커 클릭 시 인포윈도우 표시
 * 4. 지도-리스트 연동
 *
 * @dependencies
 * - Naver Maps API v3 (스크립트 로드 필요)
 * - lib/utils/coordinate.ts: 좌표 변환 유틸리티
 * - lib/types/tour.ts: TourItem 타입
 */

import { useEffect, useRef, useState } from "react";
import type { TourItem } from "@/lib/types/tour";
import { convertKATECToWGS84, calculateCenter } from "@/lib/utils/coordinate";
import { cn } from "@/lib/utils";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NaverMapProps {
  tours: TourItem[];
  selectedTourId?: string | null;
  hoveredTourId?: string | null;
  onMarkerClick?: (tour: TourItem) => void;
  onMarkerHover?: (tour: TourItem | null) => void;
  className?: string;
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
          panTo: (center: { lat: number; lng: number }) => void;
          getBounds: () => {
            getNE: () => { lat: () => number; lng: () => number };
            getSW: () => { lat: () => number; lng: () => number };
          };
          fitBounds: (bounds: {
            getNE: () => { lat: () => number; lng: () => number };
            getSW: () => { lat: () => number; lng: () => number };
          }) => void;
          getMapTypeId: () => string;
          setMapTypeId: (mapTypeId: string) => void;
        };
        Marker: new (options: {
          position: { lat: number; lng: number } | any; // LatLng 객체 또는 {lat, lng}
          map: any;
          icon?: any;
          title?: string;
          zIndex?: number;
        }) => {
          setMap: (map: any) => void;
          getPosition: () => { lat: () => number; lng: () => number };
          setIcon: (icon: any) => void;
          setZIndex: (zIndex: number) => void;
        };
        InfoWindow: new (options: {
          content: string | HTMLElement;
          maxWidth?: number;
        }) => {
          open: (map: any, marker: any) => void;
          close: () => void;
        };
        LatLngBounds: new () => {
          extend: (point: any) => void; // LatLng 객체 또는 {lat, lng} 객체
          getNE: () => { lat: () => number; lng: () => number };
          getSW: () => { lat: () => number; lng: () => number };
        };
        LatLng: new (lat: number, lng: number) => {
          lat: () => number;
          lng: () => number;
          equals: (other: any) => boolean;
        };
        event: {
          addListener: (
            instance: any,
            eventName: string,
            handler: () => void
          ) => void;
          removeListener: (
            instance: any,
            eventName: string,
            handler: () => void
          ) => void;
        };
      };
    };
  }
}

/**
 * 네이버 지도 컴포넌트
 */
export function NaverMap({
  tours,
  selectedTourId,
  hoveredTourId,
  onMarkerClick,
  onMarkerHover,
  className,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const markerToursRef = useRef<Map<any, TourItem>>(new Map()); // 마커와 관광지 매핑
  const infoWindowRef = useRef<any>(null);
  const highlightedMarkerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hoveredTourIdRef = useRef<string | null>(null);

  /**
   * 관광 타입별 마커 아이콘 생성
   */
  const getMarkerIcon = (contentTypeId: string): any => {
    const { naver } = window;
    if (!naver?.maps) return undefined;

    // 관광 타입별 색상 매핑
    const colorMap: Record<string, string> = {
      "12": "#3b82f6", // 관광지 - 파란색
      "14": "#8b5cf6", // 문화시설 - 보라색
      "15": "#ec4899", // 축제/행사 - 핑크색
      "25": "#10b981", // 여행코스 - 초록색
      "28": "#f59e0b", // 레포츠 - 주황색
      "32": "#ef4444", // 숙박 - 빨간색
      "38": "#06b6d4", // 쇼핑 - 청록색
      "39": "#f97316", // 음식점 - 주황색
    };

    const color = colorMap[contentTypeId] || "#6b7280"; // 기본 회색

    // SVG 아이콘 생성 (원형 마커)
    const svgIcon = `
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `;

    return {
      content: svgIcon,
      anchor: new (naver.maps as any).Point(16, 16),
    };
  };

  // Naver Maps API 로드 확인
  useEffect(() => {
    const checkNaverMaps = () => {
      if (typeof window !== "undefined" && window.naver?.maps) {
        setIsLoaded(true);
        setError(null);
      } else {
        // 스크립트 로드를 기다림
        const timer = setTimeout(() => {
          if (!window.naver?.maps) {
            setError("Naver Maps API를 불러올 수 없습니다.");
          }
        }, 5000); // 5초 대기

        return () => clearTimeout(timer);
      }
    };

    checkNaverMaps();
    const interval = setInterval(checkNaverMaps, 100);

    return () => clearInterval(interval);
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    try {
      const { naver } = window;
      if (!naver?.maps) return;

      // 기본 중심 좌표 (서울)
      const defaultCenter = { lat: 37.5665, lng: 126.978 };

      // 관광지 중심 좌표 계산
      const center = calculateCenter(tours) || defaultCenter;

      // 지도 생성
      const map = new naver.maps.Map(mapRef.current, {
        center,
        zoom: tours.length > 0 ? 12 : 10,
        mapTypeControl: true, // 지도 유형 컨트롤 (일반/스카이뷰)
        mapTypeControlOptions: {
          position: (naver.maps as any).Position?.TOP_RIGHT || 1, // TOP_RIGHT = 1
        },
      });

      mapInstanceRef.current = map;

      // 관광지가 있으면 경계 박스로 맞추기
      if (tours.length > 0) {
        const bounds = new naver.maps.LatLngBounds();
        tours.forEach((tour) => {
          try {
            const { lat, lng } = convertKATECToWGS84(tour.mapx, tour.mapy);
            const latLng = new naver.maps.LatLng(lat, lng);
            bounds.extend(latLng as any);
          } catch (err) {
            console.warn(`Failed to convert coordinates for tour ${tour.contentid}:`, err);
          }
        });
        map.fitBounds(bounds);
      }
    } catch (err) {
      console.error("Failed to initialize map:", err);
      setError("지도를 초기화할 수 없습니다.");
    }
  }, [isLoaded, tours]);

  // 마커 생성 및 업데이트
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || tours.length === 0) return;

    const { naver } = window;
    if (!naver?.maps) return;

    const map = mapInstanceRef.current;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
      // 이벤트 리스너 제거 (필요시)
    });
    markersRef.current = [];
    markerToursRef.current.clear(); // 매핑 초기화

    // 인포윈도우 닫기
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }

    // 기존 강조 마커 초기화
    highlightedMarkerRef.current = null;

    // 새 마커 생성
    tours.forEach((tour) => {
      try {
        const { lat, lng } = convertKATECToWGS84(tour.mapx, tour.mapy);

        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(lat, lng),
          map,
          title: tour.title,
          icon: getMarkerIcon(tour.contenttypeid), // 타입별 아이콘 적용
        });

        // 인포윈도우 생성
        const infoContent = createInfoWindowContent(tour);
        const infoWindow = new naver.maps.InfoWindow({
          content: infoContent,
          maxWidth: 300,
        });

        // 마커 클릭 이벤트
        const clickHandler = () => {
          // 기존 인포윈도우 닫기
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
          // 새 인포윈도우 열기
          infoWindow.open(map, marker);
          infoWindowRef.current = infoWindow;

          // 리스트 연동
          if (onMarkerClick) {
            onMarkerClick(tour);
          }
        };

        const mouseoverHandler = () => {
          if (onMarkerHover) {
            onMarkerHover(tour);
          }
        };

        const mouseoutHandler = () => {
          if (onMarkerHover) {
            onMarkerHover(null);
          }
        };

        // 마커 클릭 이벤트
        naver.maps.event.addListener(marker, "click", clickHandler);

        // 마커 호버 이벤트
        naver.maps.event.addListener(marker, "mouseover", mouseoverHandler);
        naver.maps.event.addListener(marker, "mouseout", mouseoutHandler);

        markersRef.current.push(marker);
        markerToursRef.current.set(marker, tour); // 마커와 관광지 매핑 저장
      } catch (err) {
        console.warn(`Failed to create marker for tour ${tour.contentid}:`, err);
      }
    });
  }, [isLoaded, tours, onMarkerClick, onMarkerHover]);

  // 선택된 관광지로 지도 이동
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !selectedTourId) return;

    const { naver } = window;
    if (!naver?.maps) return;

    const tour = tours.find((t) => t.contentid === selectedTourId);
    if (!tour) return;

    try {
      const { lat, lng } = convertKATECToWGS84(tour.mapx, tour.mapy);
      const map = mapInstanceRef.current;

      // 지도 이동
      map.panTo({ lat, lng });

      // 해당 마커의 인포윈도우 열기
      const marker = markersRef.current.find(
        (m) =>
          m.getPosition().lat() === lat && m.getPosition().lng() === lng
      );

      if (marker) {
        const infoContent = createInfoWindowContent(tour);
        const infoWindow = new naver.maps.InfoWindow({
          content: infoContent,
          maxWidth: 300,
        });
        infoWindow.open(map, marker);
        infoWindowRef.current = infoWindow;
      }
    } catch (err) {
      console.warn(`Failed to move to selected tour ${selectedTourId}:`, err);
    }
  }, [selectedTourId, tours, isLoaded]);

  /**
   * 마커 강조 (호버 또는 선택 시)
   */
  const highlightMarker = useRef((tourId: string | null) => {
    if (!isLoaded) return;

    const { naver } = window;
    if (!naver?.maps) return;

    // 기존 강조 제거
    if (highlightedMarkerRef.current) {
      const marker = highlightedMarkerRef.current;
      // 기존 강조된 마커의 원래 관광지를 찾아 원래 아이콘으로 복원
      const oldTour = markerToursRef.current.get(marker);
      if (oldTour) {
        const icon = getMarkerIcon(oldTour.contenttypeid);
        marker.setIcon(icon);
        marker.setZIndex(1);
      }
      highlightedMarkerRef.current = null;
    }

    // 새 마커 강조
    if (tourId) {
      const markerIndex = tours.findIndex((t) => t.contentid === tourId);
      const marker = markersRef.current[markerIndex];

      if (marker) {
        const tour = tours.find((t) => t.contentid === tourId);
        if (tour) {
          // 강조된 마커 아이콘 (더 크고 밝게)
          const highlightColor = "#ff0000"; // 빨간색으로 강조
          const svgIcon = `
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="${highlightColor}" stroke="white" stroke-width="3"/>
              <circle cx="20" cy="20" r="8" fill="white"/>
            </svg>
          `;
          marker.setIcon({
            content: svgIcon,
            anchor: new (naver.maps as any).Point(20, 20),
          });
          marker.setZIndex(100);
          highlightedMarkerRef.current = marker;
        }
      }
    }
  }).current;

  // 선택된 관광지 강조
  useEffect(() => {
    if (!isLoaded) return;
    if (!selectedTourId) {
      if (highlightedMarkerRef.current && !hoveredTourId) {
        highlightMarker(null);
      }
      return;
    }

    hoveredTourIdRef.current = null; // 선택 시 호버 해제
    highlightMarker(selectedTourId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTourId, tours, isLoaded, hoveredTourId]);

  // 호버된 관광지 강조 (선택이 없을 때만)
  useEffect(() => {
    if (!isLoaded || selectedTourId) return; // 선택 중이면 호버 무시

    if (hoveredTourId) {
      hoveredTourIdRef.current = hoveredTourId;
      highlightMarker(hoveredTourId);
    } else {
      hoveredTourIdRef.current = null;
      highlightMarker(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredTourId, isLoaded, selectedTourId]);


  // 인포윈도우 컨텐츠 생성
  function createInfoWindowContent(tour: TourItem): string {
    const fullAddress = tour.addr2
      ? `${tour.addr1} ${tour.addr2}`
      : tour.addr1;

    return `
      <div style="padding: 12px; min-width: 200px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0; color: #1f2937;">
          ${tour.title}
        </h3>
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 12px 0; line-height: 1.5;">
          ${fullAddress}
        </p>
        <a 
          href="/places/${tour.contentid}" 
          style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500; transition: background-color 0.2s;"
          onmouseover="this.style.backgroundColor='#2563eb'"
          onmouseout="this.style.backgroundColor='#3b82f6'"
        >
          상세보기
        </a>
      </div>
    `;
  }

  // 로딩 상태
  if (!isLoaded && !error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border bg-muted",
          className
        )}
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <MapPin className="mx-auto h-12 w-12 animate-pulse text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">지도를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10",
          className
        )}
        style={{ minHeight: "400px" }}
      >
        <div className="text-center p-4">
          <p className="text-sm font-medium text-destructive mb-2">{error}</p>
          <p className="text-xs text-muted-foreground">
            환경변수 NEXT_PUBLIC_NAVER_MAP_CLIENT_ID를 확인해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative rounded-lg overflow-hidden", className)}>
      <div
        ref={mapRef}
        className="w-full"
        style={{ minHeight: "400px", height: "100%" }}
      />
      {/* 현재 위치 버튼 */}
      {isLoaded && mapInstanceRef.current && (
        <CurrentLocationButton map={mapInstanceRef.current} />
      )}
    </div>
  );
}

/**
 * 현재 위치 버튼 컴포넌트
 */
function CurrentLocationButton({ map }: { map: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation || !map) return;

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const { naver } = window;
        if (!naver?.maps) return;

        const center = new naver.maps.LatLng(latitude, longitude);
        map.panTo(center);
        map.setZoom(15);
        setIsLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("현재 위치를 가져올 수 없습니다.");
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return (
    <Button
      onClick={handleCurrentLocation}
      disabled={isLoading}
      size="icon"
      className="absolute bottom-4 right-4 z-10 shadow-lg"
      aria-label="현재 위치로 이동"
    >
      <Navigation
        className={cn("h-5 w-5", isLoading && "animate-spin")}
        aria-hidden="true"
      />
    </Button>
  );
}

