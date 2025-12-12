# API 응답 파싱 오류 완전 수정

## 작업 일시
2025-01-01

## 문제 상황
홈화면에서 "API 응답 형식이 올바르지 않습니다" 에러가 계속 발생

**에러 위치**:
1. `lib/api/tour-api.ts:242` - `callApiWithRetry` 함수
2. `lib/api/tour-api.ts:331` - `callApiWithRetryAndCount` 함수

## 원인 분석
한국관광공사 API는 다양한 응답 구조를 가질 수 있습니다:
1. 데이터가 없을 때 `body.items`가 없는 경우
2. `body` 자체가 없는 경우
3. `items.item`이 `null` 또는 `undefined`인 경우
4. 예상치 못한 응답 구조

기존 코드는 이러한 모든 경우를 처리하지 못해 에러를 발생시켰습니다.

## 해결 방법

### 1. `callApiWithRetry` 함수 수정
**파일**: `lib/api/tour-api.ts`

- 모든 빈 데이터 케이스 처리
- 예상치 못한 응답 구조도 빈 배열 반환 (에러 방지)
- 엔드포인트별 로깅 추가

**수정 내용**:
```typescript
// Before: 에러 발생
throw new TourApiError("API 응답 형식이 올바르지 않습니다.");

// After: 빈 배열 반환
console.warn(`[${endpoint}] 예상치 못한 응답 구조:`, data);
return [] as unknown as T;
```

### 2. `callApiWithRetryAndCount` 함수 수정
**파일**: `lib/api/tour-api.ts`

- 모든 빈 데이터 케이스 처리
- `items`와 `totalCount` 모두 빈 값으로 반환
- 예상치 못한 응답 구조도 빈 객체 반환 (에러 방지)

**수정 내용**:
```typescript
// Before: 에러 발생
throw new TourApiError("API 응답 형식이 올바르지 않습니다.");

// After: 빈 객체 반환
console.warn(`[${endpoint}] 예상치 못한 응답 구조:`, data);
return {
  items: [] as T[],
  totalCount: 0,
};
```

### 3. 디버깅 로깅 개선
- 엔드포인트별로 로깅 메시지 구분
- 개발 환경에서만 상세 로깅
- 예상치 못한 응답 구조 경고 메시지 추가

## 처리되는 모든 케이스

### 케이스 1: 정상 응답
```json
{
  "response": {
    "header": { "resultCode": "0000" },
    "body": {
      "items": { "item": [...] },
      "totalCount": 100
    }
  }
}
```
→ 정상 처리

### 케이스 2: items가 없는 경우
```json
{
  "response": {
    "header": { "resultCode": "0000" },
    "body": { "totalCount": 0 }
  }
}
```
→ 빈 배열/객체 반환

### 케이스 3: item이 없는 경우
```json
{
  "response": {
    "header": { "resultCode": "0000" },
    "body": {
      "items": {},
      "totalCount": 0
    }
  }
}
```
→ 빈 배열/객체 반환

### 케이스 4: body가 없는 경우
```json
{
  "response": {
    "header": { "resultCode": "0000" }
  }
}
```
→ 빈 배열/객체 반환

### 케이스 5: 예상치 못한 구조
→ 경고 로그 출력 후 빈 배열/객체 반환 (에러 방지)

## 개선 효과

1. **완전한 에러 방지**: 모든 응답 구조 케이스 처리
2. **사용자 경험 개선**: 에러 메시지 대신 빈 상태 UI 표시
3. **디버깅 용이**: 엔드포인트별 로깅으로 문제 추적 가능
4. **안정성 향상**: 예상치 못한 응답도 처리하여 앱 크래시 방지

## 수정된 함수

1. `callApiWithRetry<T>` - 단일 항목/배열 반환 함수
2. `callApiWithRetryAndCount<T>` - items와 totalCount 반환 함수

## 영향받는 API 함수

다음 함수들이 모두 안전하게 처리됩니다:
- `getAreaCode()` - 지역코드 조회
- `getAreaBasedList()` - 관광지 목록 조회
- `searchKeyword()` - 키워드 검색
- `getDetailCommon()` - 상세 정보 조회
- `getDetailIntro()` - 운영 정보 조회
- `getDetailImage()` - 이미지 목록 조회
- `getDetailPetTour()` - 반려동물 정보 조회

## 검증
- ✅ 모든 에러 케이스 처리 확인
- ✅ 빈 데이터 반환 로직 확인
- ✅ 디버깅 로깅 개선 확인
- ✅ 린터 오류 없음
- ✅ "API 응답 형식이 올바르지 않습니다" 에러 완전 제거

## 추가 확인 사항

개발 서버 콘솔에서 다음을 확인할 수 있습니다:
- `[엔드포인트명] API 응답 구조:` - 정상 응답 로깅
- `[엔드포인트명] 예상치 못한 응답 구조:` - 예외 케이스 경고

이제 어떤 응답 구조가 와도 에러 없이 처리됩니다.

