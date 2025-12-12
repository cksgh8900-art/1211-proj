# 홈화면 초기 로딩 기본 데이터 표시 개선

## 작업 일시
2025-01-01

## 문제 상황
홈화면에서 "관광지를 찾을 수 없습니다" 메시지가 표시됨

**원인 분석**:
- 한국관광공사 API는 `areaCode`와 `contentTypeId`가 모두 없으면 빈 결과를 반환할 수 있음
- 초기 로딩 시 필터가 없으면 API가 빈 배열을 반환하여 빈 상태 UI가 표시됨

## 해결 방법

### 초기 로딩 시 기본값 설정
**파일**: `app/page.tsx`

- 필터가 없을 때 기본값 적용:
  - `areaCode`가 없으면 → 서울(1) 기본값 사용
  - `contentTypeId`가 없으면 → 관광지 타입(12) 기본값 사용
- 사용자가 필터를 선택하지 않아도 기본 데이터가 표시되도록 개선

**변경 사항**:
```typescript
// Before: 필터가 없으면 undefined로 API 호출
const result = await getAreaBasedList({
  areaCode,
  numOfRows: 12,
  pageNo: validPageNo,
});

// After: 기본값 적용
const defaultAreaCode = areaCode || "1"; // 기본값: 서울
const defaultContentTypeId = areaCode ? undefined : "12"; // 관광지 타입 기본값

const result = await getAreaBasedList({
  areaCode: defaultAreaCode,
  contentTypeId: defaultContentTypeId,
  numOfRows: 12,
  pageNo: validPageNo,
});
```

### 디버깅 로깅 추가
- 개발 환경에서 API 호출 파라미터와 결과를 로깅
- 기본값 적용 여부도 함께 표시

## 개선 효과

1. **사용자 경험 개선**: 초기 로딩 시 항상 데이터가 표시됨
2. **에러 방지**: API가 빈 결과를 반환하는 경우 방지
3. **직관적인 동작**: 필터 없이도 기본 데이터(서울 관광지) 표시

## 기본값 전략

- **지역**: 서울(1) - 가장 많은 관광지가 있는 지역
- **타입**: 관광지(12) - 가장 일반적인 타입

사용자가 필터를 선택하면 기본값은 무시되고 선택한 필터가 적용됩니다.

## 검증
- ✅ 초기 로딩 시 기본 데이터 표시 확인
- ✅ 필터 선택 시 기본값 무시 확인
- ✅ 디버깅 로깅 추가 확인
- ✅ 린터 오류 없음

## 추가 확인 사항

개발 서버 콘솔에서 다음을 확인할 수 있습니다:
- `관광지 목록 조회 결과:` - API 호출 파라미터와 결과
- `isDefault: true` - 기본값이 적용되었는지 여부

이제 홈화면 초기 로딩 시 항상 관광지 데이터가 표시됩니다.

