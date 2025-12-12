# 지역별 분포 차트 구현

## 작업 일자
2025-01-01

## 작업 개요
Phase 4의 지역별 분포 차트(Bar Chart)를 구현했습니다. shadcn/ui Chart 컴포넌트를 설치하고, recharts 기반 Bar Chart를 구현하여 지역별 관광지 개수를 시각화했습니다.

## 구현 내용

### 1. shadcn/ui Chart 컴포넌트 설치

**작업 내용:**
- `pnpx shadcn@latest add chart` 실행
- recharts 라이브러리 자동 설치 확인
- `components/ui/chart.tsx` 파일 생성 확인

**참고:**
- shadcn/ui Chart는 recharts를 래핑한 컴포넌트
- Bar Chart, Line Chart, Pie Chart 등을 지원
- 다크 모드 지원 포함

### 2. RegionChart 컴포넌트 생성

#### 2.1 Server Component (`components/stats/region-chart.tsx`)

**주요 기능:**
- `getRegionStats()` 호출하여 지역별 통계 데이터 가져오기
- 데이터가 비어있는 경우 처리
- 에러 처리 (`ErrorMessage` 컴포넌트 사용)
- 카드 형태 컨테이너 및 제목 표시

**구현 세부사항:**
- Server Component로 구현
- `BarChart3` 아이콘 사용 (lucide-react)
- 접근성 요소 추가 (aria-label, article 태그)

#### 2.2 Client Component (`components/stats/region-chart-client.tsx`)

**주요 기능:**
- Bar Chart 렌더링 (recharts 기반)
- 바 클릭 시 해당 지역 목록 페이지로 이동
- 호버 툴팁 표시

**구현 세부사항:**
- Client Component (`"use client"`)
- `ChartContainer`, `ChartTooltip`, `ChartTooltipContent` 사용
- `BarChart`, `Bar`, `XAxis`, `YAxis`, `CartesianGrid` 사용
- 데이터 정렬 (count 내림차순)
- 바 클릭 핸들러: `useRouter().push(/?area={areaCode})`
- 커스텀 툴팁: 지역명 및 관광지 개수 표시
- X축 레이블 회전 (-45도, 긴 지역명 가독성 확보)
- Y축 숫자 포맷팅 (천 단위 구분자)
- 반응형 높이 (모바일 300px, 데스크톱 400px)
- 차트 색상: `hsl(var(--chart-1))` 사용

### 3. app/stats/page.tsx 통합

**변경 내용:**
- `RegionChart` 컴포넌트 import
- 지역별 분포 차트 섹션의 Suspense 내부에 `RegionChart` 추가
- 기존 `ChartSkeleton` fallback 유지

## 파일 구조

```
components/stats/
├── stats-summary.tsx (기존)
├── region-chart.tsx (신규, Server Component)
└── region-chart-client.tsx (신규, Client Component)

app/stats/
└── page.tsx (수정)

components/ui/
└── chart.tsx (shadcn/ui 설치로 생성)
```

## 주요 기능

### 1. 데이터 시각화
- 각 시/도별 관광지 개수를 Bar Chart로 표시
- X축: 지역명 (17개 지역)
- Y축: 관광지 개수
- 데이터 정렬: count 내림차순

### 2. 인터랙션
- **바 클릭**: 해당 지역 필터링된 홈페이지로 이동 (`/?area={areaCode}`)
- **호버 툴팁**: 지역명 및 정확한 관광지 개수 표시

### 3. 반응형 디자인
- 모바일: 높이 300px
- 태블릿/데스크톱: 높이 400px
- X축 레이블 회전으로 긴 지역명 가독성 확보

### 4. 접근성
- `aria-label` 추가
- 시맨틱 HTML 사용 (article 태그)
- 차트 설명 제공

### 5. 에러 처리
- API 실패 시 `ErrorMessage` 컴포넌트 표시
- 데이터가 비어있는 경우 처리

## 참고 사항

- PRD.md 2.6.1 지역별 관광지 분포 요구사항 준수
- 기존 `stats-summary.tsx` 패턴 참고 (에러 처리, 포맷팅 함수 등)
- 홈페이지 필터 URL 구조: `/?area={areaCode}` (tour-filters.tsx 참고)
- shadcn/ui Chart 문서: https://ui.shadcn.com/docs/components/chart
- recharts는 클라이언트 컴포넌트이므로 Server Component와 분리 필요

## 다음 단계

- 타입별 분포 차트 (Donut Chart) 구현 예정

