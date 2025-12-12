/**
 * @file components/tour-detail/detail-pet-tour.tsx
 * @description 관광지 반려동물 동반 정보 섹션 컴포넌트
 *
 * 주요 기능:
 * 1. detailPetTour2 API를 통한 반려동물 동반 정보 표시
 * 2. 반려동물 동반 가능 여부, 크기 제한, 입장 가능 장소, 추가 요금, 전용 시설 정보 표시
 * 3. 정보 없는 항목 숨김 처리
 *
 * @dependencies
 * - lib/api/tour-api.ts: getDetailPetTour
 * - lib/types/tour.ts: PetTourInfo
 * - components/ui/error.tsx: ErrorMessage
 * - lucide-react: Heart, Info, Home, DollarSign, Building, Car
 */

import {
  Heart,
  Info,
  Home,
  DollarSign,
  Building,
  Car,
} from "lucide-react";
import { getDetailPetTour } from "@/lib/api/tour-api";
import type { PetTourInfo } from "@/lib/types/tour";
import { ErrorMessage } from "@/components/ui/error";

interface DetailPetTourProps {
  contentId: string;
}

/**
 * 텍스트에서 HTML 태그 제거
 */
function formatText(text: string | undefined): string {
  if (!text) return "";
  return text.replace(/<[^>]*>/g, "");
}

/**
 * 정보 항목 컴포넌트
 */
function InfoItem({
  icon,
  label,
  value,
  multiline = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  multiline?: boolean;
}) {
  if (!value) return null;

  const formattedValue = formatText(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground" aria-hidden="true">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{label}</h3>
      </div>
      <p
        className={`text-muted-foreground pl-7 ${
          multiline ? "whitespace-pre-wrap leading-relaxed" : ""
        }`}
      >
        {formattedValue}
      </p>
    </div>
  );
}

/**
 * 반려동물 동반 정보 섹션 컴포넌트 (Server Component)
 */
export async function DetailPetTour({ contentId }: DetailPetTourProps) {
  try {
    // 반려동물 정보 조회
    const petInfo = await getDetailPetTour({ contentId });

    // 데이터가 없는 경우 섹션 숨김
    if (!petInfo) {
      return null;
    }

    // 각 정보 추출
    const petLeash = petInfo.chkpetleash; // 반려동물 동반 가능 여부
    const petSize = petInfo.chkpetsize; // 반려동물 크기 제한
    const petPlace = petInfo.chkpetplace; // 입장 가능 장소
    const petCharge = petInfo.chkpetcharge; // 추가 요금
    const petInfoText = petInfo.petinfo; // 반려동물 정보
    const parking = petInfo.parking; // 주차장 정보
    const petEtc = petInfo.chkpetetc; // 추가 정보

    // 표시할 정보가 있는지 확인
    const hasAnyInfo =
      petLeash ||
      petSize ||
      petPlace ||
      petCharge ||
      petInfoText ||
      parking ||
      petEtc;

    if (!hasAnyInfo) {
      return null; // 정보가 없으면 섹션 숨김
    }

    return (
      <section
        className="rounded-lg border bg-card p-6 space-y-4"
        aria-label="반려동물 동반 정보"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">
            🐾
          </span>
          <h2 className="text-2xl font-bold">반려동물 동반 정보</h2>
        </div>

        <div className="space-y-4">
          {/* 반려동물 동반 가능 여부 */}
          {petLeash && (
            <InfoItem
              icon={<Heart className="h-5 w-5" />}
              label="반려동물 동반 가능 여부"
              value={petLeash}
              multiline
            />
          )}

          {/* 반려동물 크기 제한 */}
          {petSize && (
            <InfoItem
              icon={<Info className="h-5 w-5" />}
              label="반려동물 크기 제한"
              value={petSize}
              multiline
            />
          )}

          {/* 입장 가능 장소 */}
          {petPlace && (
            <InfoItem
              icon={<Home className="h-5 w-5" />}
              label="입장 가능 장소"
              value={petPlace}
              multiline
            />
          )}

          {/* 추가 요금 */}
          {petCharge && (
            <InfoItem
              icon={<DollarSign className="h-5 w-5" />}
              label="반려동물 동반 추가 요금"
              value={petCharge}
              multiline
            />
          )}

          {/* 반려동물 전용 시설 정보 */}
          {petInfoText && (
            <InfoItem
              icon={<Building className="h-5 w-5" />}
              label="반려동물 전용 시설 정보"
              value={petInfoText}
              multiline
            />
          )}

          {/* 주차장 정보 */}
          {parking && (
            <InfoItem
              icon={<Car className="h-5 w-5" />}
              label="주차장 정보"
              value={parking}
              multiline
            />
          )}

          {/* 추가 정보 */}
          {petEtc && (
            <InfoItem
              icon={<Info className="h-5 w-5" />}
              label="추가 정보"
              value={petEtc}
              multiline
            />
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.error("반려동물 동반 정보 로드 실패:", error);
    return (
      <section className="rounded-lg border bg-card p-6">
        <ErrorMessage
          title="반려동물 동반 정보를 불러올 수 없습니다"
          message={
            error instanceof Error
              ? error.message
              : "반려동물 동반 정보를 불러오는 중 오류가 발생했습니다."
          }
          type="api"
        />
      </section>
    );
  }
}

