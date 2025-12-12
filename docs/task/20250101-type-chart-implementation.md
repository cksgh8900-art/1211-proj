# 타입별 분포 차트 구현

## 작업 일자
2025-01-01

## 작업 개요
Phase 4의 타입별 분포 차트(Donut Chart)를 구현했습니다. shadcn/ui Chart 컴포넌트를 사용하고, recharts 기반 Donut Chart를 구현하여 타입별 관광지 분포를 시각화했습니다.

## 구현 내용

### 1. TypeChart 컴포넌트 생성

#### 1.1 Server Component (`components/stats/type-chart.tsx`)

**주요 기능:**
- `getTypeStats()` 호출하여 타입별 통계 데이터 가져오기
- 데이터가 비어있는 경우 처리
- 에러 처리 (`ErrorMessage` 컴포넌트 사용)
- 카드 형태 컨테이너 및 제목 표시

**구현 세부사항:**
- Server Component로 구현
- `PieChart` 아이콘 사용 (lucide-react)
- 접근성 요소 추가 (aria-label, article 태그)
- `region-chart.tsx`와 동일한 패턴 사용

#### 1.2 Client Component (`components/stats/type-chart-client.tsx`)

**주요 기능:**
- Donut Chart 렌더링 (recharts 기반)
- 섹션 클릭 시 해당 타입 목록 페이지로 이동
- 호버 툴팁 표시 (타입명, 개수, 비율)

**구현 세부사항:**
- Client Component (`"use client"`)
- `ChartContainer`, `ChartTooltip`, `ChartTooltipContent` 사용
- `PieChart`, `Pie`, `Cell` 사용 (recharts)
- Donut Chart 구현: `innerRadius={60}`, `outerRadius={100}`
- 각 타입별 색상 차별화 (chart-1 ~ chart-5 순환 사용)
- 섹션 클릭 핸들러: `useRouter().push(/?type={contentTypeId})`
- 커스텀 툴팁: 타입명, 개수 (천 단위 구분자), 비율 (소수점 1자리)
- 반응형 높이 (모바일 300px, 데스크톱 400px)
- 데이터 정렬 (count 내림차순)

**포맷팅 함수:**
- `formatNumber()`: 숫자 포맷팅 (천 단위 구분자)
- `formatPercentage()`: 백분율 포맷팅 (소수점 1자리)
- `stats-summary.tsx`의 포맷팅 함수와 동일한 로직 사용

### 2. app/stats/page.tsx 통합

**변경 내용:**
- `TypeChart` 컴포넌트 import
- 타입별 분포 차트 섹션의 Suspense 내부에 `TypeChart` 추가
- 기존 `ChartSkeleton` fallback 유지

## 주요 기능

### 1. 데이터 시각화
- 각 관광 타입별 관광지 개수와 비율을 Donut Chart로 표시
- 8개 타입: 관광지, 문화시설, 축제/행사, 여행코스, 레포츠, 숙박, 쇼핑, 음식점
- 데이터 정렬: count 내림차순

### 2. 인터랙션
- **섹션 클릭**: 해당 타입 필터링된 홈페이지로 이동 (`/?type={contentTypeId}`)
- **호버 툴팁**: 타입명, 관광지 개수 (천 단위 구분자), 비율 (소수점 1자리) 표시

### 3. 반응형 디자인
- 모바일: 높이 300px
- 태블릿/데스크톱: 높이 400px
- Donut Chart 크기 자동 조정

### 4. 접근성
- `aria-label` 추가
- 시맨틱 HTML 사용 (article 태그)
- 차트 설명 제공

### 5. 에러 처리
- API 실패 시 `ErrorMessage` 컴포넌트 표시
- 데이터가 비어있는 경우 처리

### 6. 색상 설정
- 각 타입별로 다른 색상 사용 (chart-1 ~ chart-5 순환)
- 다크/라이트 모드 자동 지원 (CSS 변수 사용)

## 파일 구조

```
components/stats/
├── stats-summary.tsx (기존)
├── region-chart.tsx (기존)
├── region-chart-client.tsx (기존)
├── type-chart.tsx (신규, Server Component)
└── type-chart-client.tsx (신규, Client Component)

app/stats/
└── page.tsx (수정)
```

## 참고 사항

- PRD.md 2.6.2 관광 타입별 분포 요구사항 준수
- 기존 `region-chart.tsx` 패턴 참고 (에러 처리, 포맷팅 함수 등)
- 홈페이지 필터 URL 구조: `/?type={contentTypeId}` (tour-filters.tsx 참고)
- `getTypeStats()`는 이미 percentage를 계산하여 반환 (stats-api.ts 확인)
- shadcn/ui Chart 문서: https://ui.shadcn.com/docs/components/chart
- recharts PieChart 문서 참고

