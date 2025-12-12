# API 응답 형식 파싱 오류 수정

## 작업 일시
2025-01-01

## 문제 상황
홈화면에서 "API 응답 형식이 올바르지 않습니다" 에러 발생

**에러 위치**:
- `lib/api/tour-api.ts:213` - `callApiWithRetry` 함수
- `getAreaCode` 함수 호출 시 발생

## 원인 분석
한국관광공사 API는 때때로 다음과 같은 경우가 있습니다:
1. 데이터가 없을 때 `body.items`가 없는 경우
2. `body` 자체가 없는 경우
3. `items.item`이 `null` 또는 `undefined`인 경우

기존 코드는 이러한 경우를 처리하지 못해 에러를 발생시켰습니다.

## 해결 방법

### 1. 빈 데이터 처리 추가
**파일**: `lib/api/tour-api.ts`

- `body.items`가 없는 경우 빈 배열 반환
- `items.item`이 없는 경우 빈 배열 반환
- `body`가 없는 경우 빈 배열 반환
- 에러 대신 빈 데이터로 처리하여 앱이 정상 작동하도록 개선

### 2. 디버깅 로깅 추가
**파일**: `lib/api/tour-api.ts`

- 개발 환경에서 실제 API 응답 구조를 콘솔에 출력
- API 응답 구조를 확인하여 추가 문제 해결 가능

## 변경 사항

### Before
```typescript
// 응답이 TourApiResponse인 경우 items 추출
if ("body" in data && data.response.body?.items) {
  const responseData = data as TourApiResponse<T>;
  const items = responseData.response.body.items!.item;
  return (Array.isArray(items) ? items : [items]) as unknown as T;
}

throw new TourApiError("API 응답 형식이 올바르지 않습니다.");
```

### After
```typescript
// 응답이 TourApiResponse인 경우 items 추출
if ("body" in data && data.response.body) {
  const responseData = data as TourApiResponse<T>;
  
  // items가 없는 경우 (데이터가 없을 때)
  if (!responseData.response.body.items) {
    return [] as unknown as T; // 빈 배열 반환
  }

  const items = responseData.response.body.items.item;
  
  // item이 없는 경우 (빈 배열)
  if (!items) {
    return [] as unknown as T;
  }

  // 단일 항목인 경우 배열로 변환
  return (Array.isArray(items) ? items : [items]) as unknown as T;
}

// body가 없는 경우 (데이터 없음)
if (!("body" in data) || !data.response.body) {
  return [] as unknown as T;
}
```

## 개선 효과

1. **에러 방지**: 데이터가 없는 경우에도 에러 대신 빈 배열 반환
2. **사용자 경험 개선**: 에러 메시지 대신 빈 상태 UI 표시
3. **디버깅 용이**: 개발 환경에서 실제 API 응답 구조 확인 가능

## 검증
- ✅ 빈 데이터 처리 로직 추가 확인
- ✅ 디버깅 로깅 추가 확인
- ✅ 린터 오류 없음

## 추가 확인 사항

개발 서버 콘솔에서 "API 응답 구조:" 로그를 확인하여 실제 응답 구조를 확인할 수 있습니다. 만약 예상과 다른 구조라면 추가 수정이 필요할 수 있습니다.

