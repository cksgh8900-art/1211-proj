/**
 * @file components/tour-detail/detail-intro.tsx
 * @description 관광지 운영 정보 섹션 컴포넌트
 *
 * 주요 기능:
 * 1. detailIntro2 API를 통한 운영 정보 표시
 * 2. contentTypeId별로 다른 필드 처리
 * 3. 운영시간, 휴무일, 이용요금, 주차, 수용인원, 체험 프로그램, 유모차/반려동물 동반 가능 여부 표시
 * 4. 정보 없는 항목 숨김 처리
 *
 * @dependencies
 * - lib/api/tour-api.ts: getDetailIntro, getDetailCommon
 * - lib/types/tour.ts: TourIntro, TourDetail
 * - components/ui/error.tsx: ErrorMessage
 * - lucide-react: Clock, CalendarX, DollarSign, Car, Users, PlayCircle, Baby, Heart, Phone, Info
 */

import {
  Clock,
  CalendarX,
  DollarSign,
  Car,
  Users,
  PlayCircle,
  Heart,
  Phone,
  Info,
} from "lucide-react";
import { getDetailIntro } from "@/lib/api/tour-api";
import { getDetailCommon } from "@/lib/api/tour-api";
import type { TourIntro } from "@/lib/types/tour";
import { ErrorMessage } from "@/components/ui/error";

interface DetailIntroProps {
  contentId: string;
}

/**
 * 운영시간 반환 (contentTypeId별 필드 우선순위 적용)
 */
function getOperatingHours(intro: TourIntro, contentTypeId: string): string | undefined {
  // 공통 필드 우선
  if (intro.usetime) return intro.usetime;

  // 타입별 필드
  if (contentTypeId === "12" && intro.usetimeculture) return intro.usetimeculture;
  if (contentTypeId === "15" && intro.usetimefestival) return intro.usetimefestival;
  if (contentTypeId === "28" && intro.usetimeleports) return intro.usetimeleports;
  if (contentTypeId === "39" && intro.opentimefood) return intro.opentimefood;

  return undefined;
}

/**
 * 휴무일 반환
 */
function getRestDate(intro: TourIntro, contentTypeId: string): string | undefined {
  if (intro.restdate) return intro.restdate;

  // 타입별 필드
  if (contentTypeId === "12" && intro.restdateculture) return intro.restdateculture;
  if (contentTypeId === "39" && intro.restdatefood) return intro.restdatefood;
  if (contentTypeId === "28" && intro.restdateleports) return intro.restdateleports;

  return undefined;
}

/**
 * 이용요금 반환
 */
function getUseFee(intro: TourIntro, contentTypeId: string): string | undefined {
  if (intro.usefee) return intro.usefee;
  if (contentTypeId === "28" && intro.usefeeleports) return intro.usefeeleports;
  return undefined;
}

/**
 * 주차 정보 반환
 */
function getParking(intro: TourIntro, contentTypeId: string): string | undefined {
  if (intro.parking) return intro.parking;
  if (contentTypeId === "28" && intro.parkingleports) return intro.parkingleports;
  if (contentTypeId === "32" && intro.parkinglodging) return intro.parkinglodging;
  return undefined;
}

/**
 * 수용인원 반환
 */
function getCapacity(intro: TourIntro, contentTypeId: string): string | undefined {
  if (contentTypeId === "12" && intro.accomcountlodging) return intro.accomcountlodging;
  if (contentTypeId === "14" && intro.accomcountculture) return intro.accomcountculture;
  if (contentTypeId === "28" && intro.accomcountleports) return intro.accomcountleports;
  if (contentTypeId === "39" && intro.seat) return intro.seat;
  return undefined;
}

/**
 * 체험 프로그램 반환
 */
function getExperienceProgram(intro: TourIntro, contentTypeId: string): string | undefined {
  if (contentTypeId === "15" && intro.program) return intro.program;
  // 레포츠의 경우 체험 가능 기간과 연령 정보
  if (contentTypeId === "28") {
    const parts: string[] = [];
    if (intro.openperiod) parts.push(`체험 가능 기간: ${intro.openperiod}`);
    if (intro.expagerangeleports) parts.push(`체험 가능 연령: ${intro.expagerangeleports}`);
    return parts.length > 0 ? parts.join("\n") : undefined;
  }
  return undefined;
}

/**
 * 문의처 반환
 */
function getInfoCenter(intro: TourIntro, contentTypeId: string): string | undefined {
  if (intro.infocenter) return intro.infocenter;
  if (contentTypeId === "12" && intro.infocenterlodging) return intro.infocenterlodging;
  if (contentTypeId === "28" && intro.infocenterleports) return intro.infocenterleports;
  if (contentTypeId === "39" && intro.infocenterfood) return intro.infocenterfood;
  return undefined;
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
 * 운영 정보 섹션 컴포넌트 (Server Component)
 */
export async function DetailIntro({ contentId }: DetailIntroProps) {
  try {
    // contentTypeId를 가져오기 위해 detailCommon 호출
    const detail = await getDetailCommon({ contentId });
    const contentTypeId = detail.contenttypeid;

    // 운영 정보 조회
    const intro = await getDetailIntro({ contentId, contentTypeId });

    // 각 정보 추출
    const operatingHours = getOperatingHours(intro, contentTypeId);
    const restDate = getRestDate(intro, contentTypeId);
    const useFee = getUseFee(intro, contentTypeId);
    const discountInfo =
      intro.discountinfo || (contentTypeId === "15" ? intro.discountinfofestival : undefined);
    const parking = getParking(intro, contentTypeId);
    const capacity = getCapacity(intro, contentTypeId);
    const experienceProgram = getExperienceProgram(intro, contentTypeId);
    const petAllowed = intro.chkpet;
    const infoCenter = getInfoCenter(intro, contentTypeId);
    const spendTime =
      intro.spendtime || (contentTypeId === "15" ? intro.spendtimefestival : undefined);
    const scale =
      intro.scale || (contentTypeId === "28" ? intro.scaleleports : undefined) ||
      (contentTypeId === "39" ? intro.scalefood : undefined);

    // 표시할 정보가 있는지 확인
    const hasAnyInfo =
      operatingHours ||
      restDate ||
      useFee ||
      parking ||
      capacity ||
      experienceProgram ||
      petAllowed ||
      infoCenter ||
      spendTime ||
      scale;

    if (!hasAnyInfo) {
      return null; // 정보가 없으면 섹션 숨김
    }

    return (
      <section
        className="rounded-lg border bg-card p-6 space-y-4"
        aria-label="운영 정보"
      >
        <h2 className="text-2xl font-bold mb-4">운영 정보</h2>

        <div className="space-y-4">
          {/* 운영시간 */}
          {operatingHours && (
            <InfoItem
              icon={<Clock className="h-5 w-5" />}
              label="운영시간"
              value={operatingHours}
              multiline
            />
          )}

          {/* 휴무일 */}
          {restDate && (
            <InfoItem
              icon={<CalendarX className="h-5 w-5" />}
              label="휴무일"
              value={restDate}
              multiline
            />
          )}

          {/* 이용요금 */}
          {useFee && (
            <InfoItem
              icon={<DollarSign className="h-5 w-5" />}
              label="이용요금"
              value={useFee}
              multiline
            />
          )}

          {/* 할인정보 */}
          {discountInfo && (
            <InfoItem
              icon={<DollarSign className="h-5 w-5" />}
              label="할인정보"
              value={discountInfo}
              multiline
            />
          )}

          {/* 주차 */}
          {parking && (
            <InfoItem
              icon={<Car className="h-5 w-5" />}
              label="주차"
              value={parking}
              multiline
            />
          )}

          {/* 수용인원 */}
          {capacity && (
            <InfoItem
              icon={<Users className="h-5 w-5" />}
              label="수용인원"
              value={capacity}
            />
          )}

          {/* 규모 */}
          {scale && (
            <InfoItem
              icon={<Info className="h-5 w-5" />}
              label="규모"
              value={scale}
            />
          )}

          {/* 관람 소요시간 */}
          {spendTime && (
            <InfoItem
              icon={<Clock className="h-5 w-5" />}
              label="관람 소요시간"
              value={spendTime}
            />
          )}

          {/* 체험 프로그램 */}
          {experienceProgram && (
            <InfoItem
              icon={<PlayCircle className="h-5 w-5" />}
              label="체험 프로그램"
              value={experienceProgram}
              multiline
            />
          )}

          {/* 반려동물 동반 가능 여부 */}
          {petAllowed && (
            <InfoItem
              icon={<Heart className="h-5 w-5" />}
              label="반려동물 동반"
              value={petAllowed}
            />
          )}

          {/* 문의처 */}
          {infoCenter && (
            <InfoItem
              icon={<Phone className="h-5 w-5" />}
              label="문의처"
              value={infoCenter}
              multiline
            />
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.error("관광지 운영 정보 로드 실패:", error);
    return (
      <section className="rounded-lg border bg-card p-6">
        <ErrorMessage
          title="운영 정보를 불러올 수 없습니다"
          message={
            error instanceof Error
              ? error.message
              : "관광지 운영 정보를 불러오는 중 오류가 발생했습니다."
          }
          type="api"
        />
      </section>
    );
  }
}

