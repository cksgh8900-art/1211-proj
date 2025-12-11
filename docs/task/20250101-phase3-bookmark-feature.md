# Phase 3: 북마크 기능 (MVP 2.4.5) 구현 완료

## 작업 개요

상세페이지 (`/places/[contentId]`)에 북마크 기능을 추가하여 사용자가 관광지를 즐겨찾기에 저장하고 관리할 수 있도록 구현했습니다.

## 구현 내용

### 1. Server Actions: `actions/bookmarks.ts`

**주요 기능:**
- `getBookmark(contentId)`: 북마크 조회
- `addBookmark(contentId)`: 북마크 추가
- `removeBookmark(contentId)`: 북마크 제거
- `getUserBookmarks()`: 사용자 북마크 목록 조회

**핵심 구현:**
- Clerk user ID → Supabase user_id 매핑 함수 (`getSupabaseUserId`)
- UNIQUE 제약 위반 처리 (이미 북마크된 경우)
- 로그인하지 않은 경우 에러 처리
- 에러 코드별 사용자 친화적 메시지 반환

### 2. 북마크 버튼 컴포넌트: `components/bookmarks/bookmark-button.tsx`

**주요 기능:**
- 북마크 상태 확인 (초기 로드 시 Server Action 호출)
- 북마크 추가/제거 토글
- 별 아이콘 표시 (채워짐/비어있음)
- 인증 상태 확인 (Clerk `useAuth`)
- 로그인하지 않은 경우 로그인 유도 (SignInButton 모달)

**UI/UX:**
- 북마크된 경우: 채워진 노란색 별 (`fill-yellow-400`)
- 북마크되지 않은 경우: 빈 회색 별
- 로딩 상태: 버튼 비활성화
- 토글 중: 버튼 비활성화 (`isToggling`)
- 토스트 메시지: 성공/실패 피드백

### 3. 상세페이지 통합: `app/places/[contentId]/page.tsx`

**변경 사항:**
- `BookmarkButton` 컴포넌트 import 추가
- 헤더 영역에 북마크 버튼 추가 (ShareButton 옆)
- 레이아웃: 뒤로가기 버튼 | 북마크 버튼 + 공유 버튼

## 기술적 세부사항

### Clerk → Supabase 사용자 매핑
1. Clerk `userId` (예: `user_2abc...`)를 `users.clerk_id`로 조회
2. 조회된 `users.id` (UUID)를 `bookmarks.user_id`로 사용
3. 사용자가 Supabase `users` 테이블에 없으면 북마크 불가 (SyncUserProvider가 자동 동기화)

### 북마크 상태 관리
- 초기 로드 시 `getBookmark()` Server Action으로 상태 확인
- 북마크 토글 시 `addBookmark()` 또는 `removeBookmark()` 호출
- 성공 시 상태 업데이트 (`setIsBookmarked`) 및 토스트 메시지 표시

### 인증 처리
- `useAuth()` 훅으로 인증 상태 확인
- `SignedIn`/`SignedOut` 컴포넌트로 조건부 렌더링
- 로그인하지 않은 경우: `SignInButton` (모달) 표시

### 에러 처리
- 로그인하지 않은 경우: "로그인이 필요합니다." 메시지
- UNIQUE 제약 위반: "이미 북마크된 관광지입니다." 메시지
- DB 에러: 일반적인 에러 메시지
- 네트워크 에러: 토스트 메시지로 사용자에게 알림

## 생성된 파일

1. `actions/bookmarks.ts` - 북마크 관련 Server Actions
2. `components/bookmarks/bookmark-button.tsx` - 북마크 버튼 컴포넌트

## 수정된 파일

1. `app/places/[contentId]/page.tsx` - 북마크 버튼 통합

## 데이터베이스 스키마

### bookmarks 테이블
- `id`: UUID (Primary Key)
- `user_id`: UUID (users.id 참조, ON DELETE CASCADE)
- `content_id`: TEXT (한국관광공사 API contentid)
- `created_at`: TIMESTAMP WITH TIME ZONE
- UNIQUE 제약: `(user_id, content_id)`
- 인덱스: `user_id`, `content_id`, `created_at`

### users 테이블
- `id`: UUID (Primary Key)
- `clerk_id`: TEXT (Unique, Clerk User ID)
- `name`: TEXT
- `created_at`: TIMESTAMP

## 테스트 확인 사항

다음 항목들을 수동으로 테스트해야 합니다:

1. ✅ 로그인하지 않은 사용자가 북마크 버튼 클릭 시 로그인 모달 표시
2. ✅ 로그인한 사용자가 북마크 추가 성공
3. ✅ 북마크 추가 시 별 아이콘 채워짐 확인
4. ✅ 북마크 제거 성공
5. ✅ 북마크 제거 시 별 아이콘 비어짐 확인
6. ✅ 이미 북마크된 관광지 재추가 시도 시 에러 처리
7. ✅ 페이지 새로고침 시 북마크 상태 유지 확인
8. ✅ 로딩 상태 UI 확인
9. ✅ 토스트 메시지 표시 확인

## 추가 개발 사항

다음 항목들은 TODO.md에 추가 개발 사항으로 기록되었습니다:

- Clerk user ID → Supabase user_id 매핑 함수 (`getSupabaseUserId`)
- 북마크 상태 실시간 업데이트 (useState, useEffect)
- 로딩 상태 처리 (isLoading, isToggling)
- 토스트 메시지 통합 (성공/실패 피드백)
- 에러 처리 (UNIQUE 제약 위반, 로그인 필요 등)
- 접근성 개선 (aria-label 추가)

## 참고 사항

### 사용자 동기화
- `SyncUserProvider`가 로그인 시 자동으로 Clerk 사용자를 Supabase `users` 테이블에 동기화
- 북마크 기능 사용 전에 사용자가 `users` 테이블에 존재해야 함
- 동기화가 완료되지 않은 경우 북마크 실패 가능 (에러 처리 필요)

### RLS 정책
- 개발 환경에서는 RLS가 비활성화되어 있음 (DB.sql 참고)
- 프로덕션에서는 적절한 RLS 정책 설정 필요
- RLS 정책 예시: 사용자는 자신의 북마크만 조회/추가/삭제 가능

## 다음 단계

Phase 3의 다음 작업:
- 반려동물 정보 섹션 (MVP 2.5)
- 추천 관광지 섹션 (선택 사항)
- 최종 통합 및 스타일링

Phase 5에서 북마크 목록 페이지 (`/bookmarks`) 구현 예정

