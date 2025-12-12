# Phase 5: 북마크 목록 페이지 구현 완료

**작업일**: 2025-01-01  
**Phase**: Phase 5 - 북마크 페이지 (`/bookmarks`)  
**작업 항목**: 북마크 목록 페이지

## 구현 내용

### 1. Server Actions 확장 (`actions/bookmarks.ts`)

#### `getBookmarkedTours()` 함수 추가
- **기능**: 북마크된 관광지의 상세 정보 조회
- **구현 세부사항**:
  - `getUserBookmarks()`로 contentId 배열 조회 (북마크 생성일시 포함)
  - 각 contentId에 대해 `getDetailCommon()` 병렬 호출
  - `TourDetail`을 `TourItem` 형태로 변환
  - 에러 처리: 일부 실패해도 계속 진행 (성공한 항목만 반환)
  - 북마크 생성일시(`created_at`) 정보를 Map 형태로 반환

**반환 타입**:
```typescript
{
  tours: TourItem[];
  bookmarkDates: Map<string, string>; // contentId -> created_at
}
```

### 2. 북마크 목록 페이지 (`app/bookmarks/page.tsx`)

#### 페이지 기본 구조
- **Server Component**로 구현
- **Clerk 인증 확인**: `auth()` 함수 사용
- **로그인하지 않은 경우**: `SignedOut` + `SignInButton`으로 로그인 유도
- **메타데이터 설정**: title, description, Open Graph, Twitter Card

#### 인증 상태 처리
- `SignedIn`: 북마크 목록 데이터 로드
- `SignedOut`: 로그인 유도 UI 표시

#### 데이터 페칭
- `getBookmarkedTours()` Server Action 호출
- Suspense 경계 설정 (북마크 목록)
- 에러 처리

### 3. 북마크 목록 컴포넌트 (`components/bookmarks/bookmark-list.tsx`)

#### 컴포넌트 기본 구조
- **Client Component**로 구현
- props: `tours` (TourItem 배열), `bookmarkDates` (Map<contentId, created_at>)

#### 카드 레이아웃
- `TourCard` 컴포넌트 재사용
- 그리드 레이아웃 (모바일: 1열, 태블릿: 2열, 데스크톱: 3열)
- 반응형 디자인

#### 빈 상태 처리
- 북마크가 없을 때 안내 메시지
- "관광지 둘러보기" 링크 버튼
- 아이콘 및 친화적인 메시지

#### 로딩 상태
- `BookmarkListSkeleton` 컴포넌트 (Skeleton UI)
- `components/ui/skeleton.tsx` 사용

### 4. 북마크 관리 기능

#### 4.1 정렬 옵션 (`components/bookmarks/bookmark-sort.tsx`)

**구현 내용**:
- 정렬 옵션 선택 UI (shadcn/ui Select)
- 옵션: 최신순, 이름순, 지역별
- URL 쿼리 파라미터로 상태 관리 (`sort`)
- 클라이언트 사이드 정렬 로직 (useMemo 사용)

**정렬 로직**:
- **최신순**: 북마크 생성일시 내림차순 (`created_at DESC`)
- **이름순**: 관광지명 가나다순 (`title.localeCompare`)
- **지역별**: 지역코드 오름차순 → 이름순

#### 4.2 개별 삭제 기능 (`components/bookmarks/bookmark-delete-button.tsx`)

**구현 내용**:
- 각 카드에 삭제 버튼 (호버 시 표시)
- 휴지통 아이콘 (Trash2 from lucide-react)
- 클릭 시 확인 다이얼로그 표시 (shadcn/ui Dialog)
- `removeBookmark()` Server Action 호출
- 삭제 후 페이지 새로고침 (`router.refresh()`)
- 토스트 메시지 표시 (성공/실패)

#### 4.3 일괄 삭제 기능 (`components/bookmarks/bookmark-bulk-actions.tsx`)

**구현 내용**:
- 체크박스 선택 UI (shadcn/ui Checkbox)
- "전체 선택" / "전체 해제" 버튼
- 선택된 항목 개수 표시
- "선택 항목 삭제" 버튼
- 확인 다이얼로그 (shadcn/ui Dialog)

**일괄 삭제 로직**:
- 선택된 contentId 배열로 `removeBookmark()` 병렬 호출
- 삭제 후 페이지 새로고침
- 에러 처리: 일부 실패해도 계속 진행
- 토스트 메시지 표시 (성공/실패 개수)

**상태 관리**:
- `selectedIds` Set으로 선택된 항목 관리
- 부모 컴포넌트(`BookmarkList`)에서 상태 관리
- props로 전달하여 통합

### 5. 페이지 통합 및 스타일링

#### 레이아웃 구조
- 헤더 영역 (페이지 제목, 설명)
- 정렬 옵션 영역 (Sticky, 상단 고정)
- 북마크 목록 영역

#### 반응형 디자인
- 모바일: 1열 그리드
- 태블릿: 2열 그리드
- 데스크톱: 3열 그리드

#### 접근성
- ARIA 라벨 추가 (`role="list"`, `role="listitem"`, `aria-label`)
- 키보드 네비게이션 지원
- 시맨틱 HTML 사용

### 6. 네비게이션 통합

- `components/Navbar.tsx`에 이미 북마크 링크 존재 확인
- 로그인한 사용자에게만 표시 (`SignedIn` 컴포넌트 사용)
- 데스크톱 및 모바일 메뉴 모두 포함

## 생성된 파일

1. `app/bookmarks/page.tsx` - 북마크 목록 페이지
2. `components/bookmarks/bookmark-list.tsx` - 북마크 목록 컴포넌트
3. `components/bookmarks/bookmark-sort.tsx` - 정렬 옵션 컴포넌트
4. `components/bookmarks/bookmark-delete-button.tsx` - 개별 삭제 버튼
5. `components/bookmarks/bookmark-bulk-actions.tsx` - 일괄 삭제 기능

## 수정된 파일

1. `actions/bookmarks.ts` - `getBookmarkedTours()` 함수 추가

## 주요 기능

### 정렬 기능
- 최신순: 북마크 생성일시 기준 내림차순
- 이름순: 관광지명 가나다순
- 지역별: 지역코드 오름차순 → 이름순

### 삭제 기능
- 개별 삭제: 각 카드에 삭제 버튼 (호버 시 표시)
- 일괄 삭제: 체크박스로 여러 항목 선택 후 일괄 삭제
- 확인 다이얼로그로 실수 방지

### 사용자 경험
- 호버 시 체크박스 및 삭제 버튼 표시 (opacity 전환)
- 삭제 후 자동 새로고침으로 목록 업데이트
- 토스트 메시지로 피드백 제공
- 빈 상태 시 안내 메시지 및 링크 제공

## 기술 스택

- **Next.js 15.5.7** (App Router, Server/Client Components)
- **Clerk** (인증 확인)
- **Supabase** (북마크 데이터 조회)
- **shadcn/ui** (Select, Dialog, Checkbox, Button)
- **lucide-react** (아이콘)
- **Tailwind CSS v4** (스타일링)

## 참고 파일

- [actions/bookmarks.ts](../../actions/bookmarks.ts) - 북마크 Server Actions
- [components/tour-card.tsx](../../components/tour-card.tsx) - 관광지 카드 컴포넌트
- [components/bookmarks/bookmark-button.tsx](../../components/bookmarks/bookmark-button.tsx) - 북마크 버튼
- [lib/api/tour-api.ts](../../lib/api/tour-api.ts) - 관광지 API 클라이언트
- [app/stats/page.tsx](../../app/stats/page.tsx) - 유사한 페이지 구조 참고
- [docs/PRD.md](../PRD.md) - 북마크 기능 요구사항
- [docs/TODO.md](../TODO.md) - Phase 5 작업 목록

---

**작성자**: AI Assistant  
**작성일**: 2025-01-01

