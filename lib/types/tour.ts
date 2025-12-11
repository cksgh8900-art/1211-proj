/**
 * @file 관광지 관련 TypeScript 타입 정의
 * @description 한국관광공사 API 응답 타입 정의
 * 
 * PRD.md 5장 데이터 구조 기반으로 작성
 * 한국관광공사 API: https://www.data.go.kr/data/15101578/openapi.do
 */

/**
 * Content Type ID (관광 타입)
 * PRD.md 4.4 참고
 */
export const CONTENT_TYPE_ID = {
  TOURIST_SPOT: "12", // 관광지
  CULTURAL_FACILITY: "14", // 문화시설
  FESTIVAL: "15", // 축제/행사
  TOUR_COURSE: "25", // 여행코스
  LEISURE_SPORTS: "28", // 레포츠
  ACCOMMODATION: "32", // 숙박
  SHOPPING: "38", // 쇼핑
  RESTAURANT: "39", // 음식점
} as const;

export type ContentTypeId = typeof CONTENT_TYPE_ID[keyof typeof CONTENT_TYPE_ID];

/**
 * 지역코드 정보 (areaCode2 응답)
 */
export interface AreaCode {
  code: string; // 지역코드
  name: string; // 지역명
  rnum?: string; // 순번
}

/**
 * 관광지 목록 항목 (areaBasedList2, searchKeyword2 응답)
 * PRD.md 5.1 참고
 */
export interface TourItem {
  addr1: string; // 주소
  addr2?: string; // 상세주소
  areacode: string; // 지역코드
  sigungucode?: string; // 시군구코드
  contentid: string; // 콘텐츠ID
  contenttypeid: string; // 콘텐츠타입ID
  title: string; // 제목
  mapx: string; // 경도 (KATEC 좌표계, 정수형)
  mapy: string; // 위도 (KATEC 좌표계, 정수형)
  firstimage?: string; // 대표이미지1
  firstimage2?: string; // 대표이미지2
  tel?: string; // 전화번호
  cat1?: string; // 대분류
  cat2?: string; // 중분류
  cat3?: string; // 소분류
  createdtime?: string; // 등록일
  modifiedtime: string; // 수정일
  booktour?: string; // 교과서 속 여행지 여부
  mlevel?: string; // Map level
  zipcode?: string; // 우편번호
}

/**
 * 관광지 상세 정보 (detailCommon2 응답)
 * PRD.md 5.2 참고
 */
export interface TourDetail {
  contentid: string; // 콘텐츠ID
  contenttypeid: string; // 콘텐츠타입ID
  title: string; // 제목
  createdtime?: string; // 등록일
  modifiedtime?: string; // 수정일
  tel?: string; // 전화번호
  telname?: string; // 전화번호명
  homepage?: string; // 홈페이지
  booktour?: string; // 교과서 속 여행지 여부
  firstimage?: string; // 대표이미지1
  firstimage2?: string; // 대표이미지2
  cpyrhtDivCd?: string; // 저작권 유형
  areacode: string; // 지역코드
  sigungucode?: string; // 시군구코드
  cat1?: string; // 대분류
  cat2?: string; // 중분류
  cat3?: string; // 소분류
  cat1name?: string; // 대분류명
  cat2name?: string; // 중분류명
  cat3name?: string; // 소분류명
  fullAddr?: string; // 전체주소
  addr1: string; // 주소
  addr2?: string; // 상세주소
  zipcode?: string; // 우편번호
  mapx: string; // 경도 (KATEC 좌표계)
  mapy: string; // 위도 (KATEC 좌표계)
  mlevel?: string; // Map level
  overview?: string; // 개요 (긴 설명)
  overviewsim?: string; // 개요 요약
}

/**
 * 관광지 운영 정보 (detailIntro2 응답)
 * PRD.md 5.3 참고
 * contentTypeId별로 필드가 다름
 */
export interface TourIntro {
  contentid: string; // 콘텐츠ID
  contenttypeid: string; // 콘텐츠타입ID
  
  // 공통 필드
  infocenter?: string; // 문의처
  restdate?: string; // 휴무일
  usetime?: string; // 이용시간
  parking?: string; // 주차 가능
  chkpet?: string; // 반려동물 동반
  
  // 관광지(12) 관련 필드
  heritage1?: string; // 세계문화유산
  heritage2?: string; // 세계자연유산
  heritage3?: string; // 세계기록유산
  infocenterlodging?: string; // 숙박시설 문의처
  accomcountlodging?: string; // 숙박시설 수용인원
  usetimeculture?: string; // 문화시설 이용시간
  restdateculture?: string; // 문화시설 휴무일
  usefee?: string; // 이용요금
  discountinfo?: string; // 할인정보
  spendtime?: string; // 관람 소요시간
  scale?: string; // 규모
  
  // 문화시설(14) 관련 필드
  // usefee, discountinfo, spendtime, scale은 관광지와 공통이므로 위에 정의됨
  accomcountculture?: string; // 수용인원
  
  // 축제/행사(15) 관련 필드
  sponsor1?: string; // 주최자 정보1
  sponsor1tel?: string; // 주최자 정보1 연락처
  sponsor2?: string; // 주최자 정보2
  sponsor2tel?: string; // 주최자 정보2 연락처
  eventstartdate?: string; // 행사 시작일
  eventenddate?: string; // 행사 종료일
  eventplace?: string; // 행사 장소
  eventhomepage?: string; // 행사 홈페이지
  agelimit?: string; // 관람 가능연령
  bookingplace?: string; // 예매처
  placeinfo?: string; // 행사장 위치안내
  subevent?: string; // 부대행사
  program?: string; // 행사 프로그램
  playtime?: string; // 공연시간
  usetimefestival?: string; // 축제 이용시간
  discountinfofestival?: string; // 축제 할인정보
  spendtimefestival?: string; // 축제 관람 소요시간
  festivalgrade?: string; // 축제등급
  
  // 여행코스(25) 관련 필드
  distance?: string; // 코스 총 거리
  taketime?: string; // 코스 총 소요시간
  theme?: string; // 코스 테마
  
  // 레포츠(28) 관련 필드
  openperiod?: string; // 체험 가능 기간
  reservation?: string; // 예약안내
  infocenterleports?: string; // 문의 및 안내
  scaleleports?: string; // 규모
  accomcountleports?: string; // 수용인원
  restdateleports?: string; // 쉬는날
  usetimeleports?: string; // 이용시간
  usefeeleports?: string; // 입장료
  expagerangeleports?: string; // 체험 가능 연령
  parkingleports?: string; // 주차시설
  
  // 숙박(32) 관련 필드
  goodstay?: string; // 굿스테이 여부
  hanok?: string; // 한옥 여부
  benikia?: string; // 베니키아 여부
  roomcount?: string; // 객실수
  roomtype?: string; // 객실유형
  refundregulation?: string; // 환불규정
  checkintime?: string; // 체크인 시간
  checkouttime?: string; // 체크아웃 시간
  chkcooking?: string; // 취사 가능 여부
  seminar?: string; // 세미나실 여부
  sports?: string; // 체육시설 여부
  sauna?: string; // 사우나 여부
  beauty?: string; // 미용시설 여부
  beverage?: string; // 음료장 여부
  karaoke?: string; // 노래방 여부
  barbecue?: string; // 바베큐장 여부
  campfire?: string; // 캠프파이어 여부
  bicycle?: string; // 자전거 대여 여부
  fitness?: string; // 피트니스 여부
  publicpc?: string; // 공용 PC실 여부
  publicbath?: string; // 대중목욕탕 여부
  subfacility?: string; // 부대시설
  foodplace?: string; // 식음료장
  reservationlodging?: string; // 예약안내
  reservationurl?: string; // 예약안내 홈페이지
  parkinglodging?: string; // 주차시설
  
  // 쇼핑(38) 관련 필드
  opendateshopping?: string; // 개장일
  shoppingguide?: string; // 쇼핑 안내
  culturecenter?: string; // 문화센터 바로가기
  fairday?: string; // 장서는 날
  
  // 음식점(39) 관련 필드
  opentimefood?: string; // 영업시간
  restdatefood?: string; // 쉬는날
  treatmenu?: string; // 대표 메뉴
  packing?: string; // 포장 가능 여부
  infocenterfood?: string; // 문의 및 안내
  scalefood?: string; // 규모
  seat?: string; // 좌석수
  kidsfacility?: string; // 어린이 놀이방 여부
  firstmenu?: string; // 대표 메뉴1
  reservationfood?: string; // 예약안내
  lcnsno?: string; // 인허가 번호
  cpyrhtDivCd?: string; // 저작권 유형
}

/**
 * 관광지 이미지 정보 (detailImage2 응답)
 */
export interface TourImage {
  contentid: string; // 콘텐츠ID
  originimgurl: string; // 원본 이미지 URL
  imgname: string; // 이미지명
  serialnum: string; // 이미지 순번
  smallimageurl?: string; // 썸네일 이미지 URL
  cpyrhtDivCd?: string; // 저작권 유형
}

/**
 * 반려동물 동반 여행 정보 (detailPetTour2 응답)
 * PRD.md 2.5 참고
 */
export interface PetTourInfo {
  contentid: string; // 콘텐츠ID
  contenttypeid: string; // 콘텐츠타입ID
  chkpetleash?: string; // 애완동물 동반 여부
  chkpetsize?: string; // 애완동물 크기 제한
  chkpetplace?: string; // 입장 가능 장소 (실내/실외)
  chkpetetc?: string; // 애완동물 동반 추가 정보
  chkpetcharge?: string; // 애완동물 동반 추가 요금
  petinfo?: string; // 반려동물 정보
  parking?: string; // 주차장 정보 (반려동물 하차 공간)
}

/**
 * 한국관광공사 API 응답 래퍼
 * 모든 API 응답은 다음 구조를 가짐:
 * {
 *   response: {
 *     header: { resultCode, resultMsg },
 *     body: { items: { item: T[] }, totalCount, numOfRows, pageNo }
 *   }
 * }
 */
export interface TourApiResponse<T> {
  response: {
    header: {
      resultCode: string; // 결과 코드
      resultMsg: string; // 결과 메시지
    };
    body: {
      items?: {
        item: T | T[]; // 단일 항목 또는 배열
      };
      totalCount?: number; // 전체 개수
      numOfRows?: number; // 페이지당 항목 수
      pageNo?: number; // 페이지 번호
    };
  };
}

/**
 * API 에러 응답
 */
export interface TourApiErrorResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body?: {
      items?: unknown;
    };
  };
}

/**
 * API 함수 파라미터 타입
 */
export interface AreaCodeParams {
  areaCode?: string; // 상위 지역 코드 (선택)
  numOfRows?: number; // 페이지당 항목 수
  pageNo?: number; // 페이지 번호
}

export interface AreaBasedListParams {
  areaCode: string; // 지역 코드
  contentTypeId: string; // 콘텐츠 타입 ID
  sigunguCode?: string; // 시군구 코드
  cat1?: string; // 대분류
  cat2?: string; // 중분류
  cat3?: string; // 소분류
  numOfRows?: number; // 페이지당 항목 수
  pageNo?: number; // 페이지 번호
}

export interface SearchKeywordParams {
  keyword: string; // 검색 키워드
  areaCode?: string; // 지역 코드
  contentTypeId?: string; // 콘텐츠 타입 ID
  numOfRows?: number; // 페이지당 항목 수
  pageNo?: number; // 페이지 번호
}

export interface DetailCommonParams {
  contentId: string; // 콘텐츠 ID
  defaultYN?: "Y" | "N"; // 기본정보 조회여부
  firstImageYN?: "Y" | "N"; // 원본, 썸네일 대표이미지 조회여부
  addrinfoYN?: "Y" | "N"; // 주소정보 조회여부
  mapinfoYN?: "Y" | "N"; // 좌표정보 조회여부
  overviewYN?: "Y" | "N"; // 개요정보 조회여부
}

export interface DetailIntroParams {
  contentId: string; // 콘텐츠 ID
  contentTypeId: string; // 콘텐츠 타입 ID
}

export interface DetailImageParams {
  contentId: string; // 콘텐츠 ID
  imageYN?: "Y" | "N"; // 이미지 조회여부
  subImageYN?: "Y" | "N"; // 서브 이미지 조회여부
}

export interface DetailPetTourParams {
  contentId: string; // 콘텐츠 ID
}

