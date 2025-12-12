# 홈페이지 관광지 데이터 표시 오류 수정

## 날짜
2025-12-12

## 문제 설명
localhost 서버 홈화면에서 "관광지를 찾을 수 없습니다" 메시지가 표시되고, API에서 데이터를 가져오는 것은 성공했지만 화면에 표시되지 않는 문제가 발생했습니다.

## 원인 분석

### 1. API 응답 파싱 오류 (`lib/api/tour-api.ts`)
`callApiWithRetryAndCount` 함수에서 응답 데이터를 추출하는 조건문이 잘못되어 있었습니다.

**문제 코드:**
```typescript
if ("body" in data && data.response.body) {
```

`"body" in data`는 최상위 `data` 객체에 `body` 키가 있는지 확인하지만, 실제 구조는 `data.response.body`이므로 조건이 항상 `false`가 되어 데이터 추출이 실패했습니다.

**수정 코드:**
```typescript
if (data.response && data.response.body) {
```

### 2. 좌표 변환 오류 (`lib/utils/coordinate.ts`)
한국관광공사 API(KorService2)가 반환하는 좌표 형식이 예상과 달랐습니다.

**기존 가정:** KATEC 좌표계 정수형 (예: `"1270000000"`)
**실제 응답:** WGS84 좌표계 소수점 형식 (예: `"126.9846616856"`)

**문제 코드:**
```typescript
const lng = Number.parseInt(mapx, 10) / 10000000;
const lat = Number.parseInt(mapy, 10) / 10000000;
```

`parseInt("126.9846616856")`는 `126`을 반환하고, `/10000000`하면 `0.0000126`이 됩니다.

**수정 코드:**
```typescript
// 소수점 여부 확인하여 형식 판단
const hasDecimalX = mapx.includes(".");
const hasDecimalY = mapy.includes(".");

if (hasDecimalX && hasDecimalY) {
  // 소수점 형식: 이미 WGS84 좌표계이므로 그대로 파싱
  lng = Number.parseFloat(mapx);
  lat = Number.parseFloat(mapy);
} else {
  // 정수 형식: KATEC 좌표계이므로 10000000으로 나누기
  lng = Number.parseInt(mapx, 10) / 10000000;
  lat = Number.parseInt(mapy, 10) / 10000000;
}
```

## 수정된 파일
1. `lib/api/tour-api.ts` - API 응답 파싱 로직 수정
2. `lib/utils/coordinate.ts` - 좌표 변환 로직 수정

## 결과
- 홈페이지에서 12개의 관광지 데이터가 정상적으로 표시됨
- 지도에 마커가 올바른 위치에 표시됨
- 서울 지역 관광지 데이터가 기본으로 로드됨 (totalCount: 799)

## 디버깅 로그
개발 환경에서 다음 로그들이 출력되어 디버깅에 활용됨:
- `[/areaBasedList2] API 응답 구조:` - 전체 API 응답 JSON
- `[/areaBasedList2] totalCount 추출:` - 추출된 totalCount 값
- `[/areaBasedList2] 추출된 items 수:` - 추출된 항목 개수
- `관광지 목록 조회 결과:` - 최종 조회 결과 요약

## 학습 포인트
1. API 응답 구조를 정확히 파악하고, 조건문에서 올바른 경로로 접근해야 함
2. 외부 API의 좌표 형식이 문서와 다를 수 있으므로, 실제 응답을 확인하고 유연하게 처리해야 함
3. 개발 환경에서 디버깅 로그를 적극 활용하면 문제 원인 파악이 빨라짐

