# Clerk + Supabase 통합 가이드

이 문서는 2025년 최신 모범 사례를 기반으로 Clerk와 Supabase를 통합하는 방법을 설명합니다.

## 개요

이 프로젝트는 **Clerk의 네이티브 Supabase 통합** (2025년 4월 이후 권장 방식)을 사용합니다. 이전의 JWT 템플릿 방식은 더 이상 권장되지 않습니다.

### 주요 장점

- ✅ JWT 템플릿 불필요
- ✅ 각 요청마다 새 토큰을 가져올 필요 없음
- ✅ Supabase JWT secret을 Clerk와 공유할 필요 없음
- ✅ 더 나은 보안성과 성능

## 1. Clerk Dashboard에서 Supabase 통합 설정

1. [Clerk Dashboard의 Supabase 통합 페이지](https://dashboard.clerk.com/setup/supabase)로 이동합니다.
2. 설정 옵션을 선택하고 **"Activate Supabase integration"**을 클릭합니다.
3. 표시된 **Clerk domain**을 복사합니다 (예: `your-app.clerk.accounts.dev`).

## 2. Supabase Dashboard에서 Clerk를 Third-Party Auth Provider로 추가

1. [Supabase Dashboard](https://supabase.com/dashboard)에서 프로젝트를 엽니다.
2. **Authentication > Sign In / Up** 섹션으로 이동합니다.
3. **Third-Party Auth** 탭을 선택합니다.
4. **"Add provider"** 버튼을 클릭하고 **"Clerk"**를 선택합니다.
5. 위에서 복사한 **Clerk domain**을 붙여넣습니다.
6. **"Save"**를 클릭하여 연결을 생성합니다.

## 3. 로컬 개발 환경 설정 (선택사항)

로컬에서 Supabase CLI를 사용하는 경우, `supabase/config.toml` 파일에 다음 설정을 추가하세요:

```toml
[auth.third_party.clerk]
enabled = true
domain = "your-app.clerk.accounts.dev"
```

## 4. 프로젝트 구조

### Supabase 클라이언트 파일들

프로젝트는 환경별로 Supabase 클라이언트를 분리하여 관리합니다:

#### `lib/supabase/clerk-client.ts` - Client Component용

```typescript
'use client';
import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';

export default function MyComponent() {
  const supabase = useClerkSupabaseClient();
  
  // Clerk 세션 토큰을 사용하여 인증된 요청 실행
  const { data } = await supabase.from('tasks').select('*');
}
```

#### `lib/supabase/server.ts` - Server Component/Server Action용

```typescript
import { createClerkSupabaseClient } from '@/lib/supabase/server';

export default async function MyPage() {
  const supabase = createClerkSupabaseClient();
  const { data } = await supabase.from('tasks').select('*');
  return <div>...</div>;
}
```

#### `lib/supabase/service-role.ts` - 관리자 작업용

```typescript
import { getServiceRoleClient } from '@/lib/supabase/service-role';

// RLS를 우회하여 관리자 작업 수행 (서버 사이드 전용)
const supabase = getServiceRoleClient();
```

#### `lib/supabase/client.ts` - 공개 데이터용

```typescript
import { supabase } from '@/lib/supabase/client';

// 인증 불필요한 공개 데이터 접근
const { data } = await supabase.from('public_posts').select('*');
```

## 5. Row Level Security (RLS) 정책

### 개발 환경

개발 중에는 RLS를 비활성화하여 권한 관련 에러를 방지합니다. 이는 `.cursor/rules/supabase/disable-rls-for-development.mdc` 규칙에 명시되어 있습니다.

### 프로덕션 환경

프로덕션 배포 전에는 반드시 적절한 RLS 정책을 설정해야 합니다.

#### Clerk 세션 토큰에서 사용자 ID 가져오기

Clerk와 통합된 경우, `auth.jwt()->>'sub'`로 Clerk user ID를 가져올 수 있습니다:

```sql
-- 예시: 사용자가 자신의 데이터만 접근 가능하도록 설정
CREATE POLICY "Users can view their own tasks"
ON "public"."tasks"
FOR SELECT
TO authenticated
USING (
  ((SELECT auth.jwt()->>'sub') = (user_id)::text)
);

CREATE POLICY "Users must insert their own tasks"
ON "public"."tasks"
FOR INSERT
TO authenticated
WITH CHECK (
  ((SELECT auth.jwt()->>'sub') = (user_id)::text)
);
```

#### 예제: Tasks 테이블

`supabase/migrations/20250101000000_create_tasks_with_rls.sql` 파일을 참고하세요.

## 6. 사용자 동기화

이 프로젝트는 `SyncUserProvider`를 통해 Clerk 사용자를 Supabase `users` 테이블에 자동 동기화합니다:

- `components/providers/sync-user-provider.tsx`: RootLayout에서 자동 실행
- `hooks/use-sync-user.ts`: 사용자 동기화 로직
- `app/api/sync-user/route.ts`: 실제 동기화 API 엔드포인트

## 7. 환경 변수

`.env` 파일에 다음 변수들이 설정되어 있어야 합니다:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

## 8. 테스트

통합이 올바르게 작동하는지 확인하기 위해:

1. 사용자로 로그인합니다.
2. 데이터를 생성하고 조회합니다.
3. 다른 사용자로 로그인하여 동일한 데이터에 접근할 수 없는지 확인합니다 (RLS가 활성화된 경우).

예제 테스트 코드는 `app/auth-test/page.tsx`를 참고하세요.

## 참고 자료

- [Clerk 공식 문서: Supabase 통합](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Supabase 공식 문서: Clerk Third-Party Auth](https://supabase.com/docs/guides/auth/third-party/clerk)
- [Supabase RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)

## 문제 해결

### RLS 정책이 작동하지 않음

1. Clerk에서 `role` 클레임이 세션 토큰에 포함되어 있는지 확인
2. Supabase Dashboard에서 Clerk 통합이 활성화되어 있는지 확인
3. RLS가 테이블에 활성화되어 있는지 확인: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`

### 인증 토큰 오류

1. 환경 변수가 올바르게 설정되어 있는지 확인
2. Clerk domain이 Supabase Dashboard에 올바르게 입력되었는지 확인
3. 브라우저 콘솔과 서버 로그에서 에러 메시지 확인

