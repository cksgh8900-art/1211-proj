# Clerk 한국어 로컬라이제이션 가이드

이 문서는 Clerk 컴포넌트를 한국어로 설정하고 커스터마이징하는 방법을 설명합니다.

## 개요

Clerk는 `@clerk/localizations` 패키지를 통해 다양한 언어 지원을 제공합니다. 이 프로젝트는 한국어(ko-KR) 로컬라이제이션을 사용하며, 필요에 따라 커스터마이징할 수 있습니다.

## 설정 확인

### 패키지 설치

`@clerk/localizations` 패키지가 이미 설치되어 있는지 확인하세요:

```bash
npm list @clerk/localizations
```

설치되어 있지 않다면:

```bash
npm install @clerk/localizations
```

### 현재 설정

프로젝트의 `app/layout.tsx`에서 한국어 로컬라이제이션이 이미 적용되어 있습니다:

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import { customKoKR } from "@/lib/clerk/localization";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={customKoKR}>
      <html lang="ko">
        {/* ... */}
      </html>
    </ClerkProvider>
  );
}
```

## 커스텀 로컬라이제이션

### 기본 사용

기본 제공되는 한국어 로컬라이제이션을 사용하려면:

```tsx
import { koKR } from "@clerk/localizations";

<ClerkProvider localization={koKR}>
  {/* ... */}
</ClerkProvider>
```

### 커스텀 메시지 추가

`lib/clerk/localization.ts` 파일에서 커스텀 로컬라이제이션을 정의할 수 있습니다:

```typescript
import { koKR } from "@clerk/localizations";

export const customKoKR = {
  ...koKR,
  
  // 에러 메시지 커스터마이징
  unstable__errors: {
    ...koKR.unstable__errors,
    not_allowed_access:
      "접근이 허용되지 않은 이메일입니다. 기업 이메일 도메인을 허용 목록에 추가하려면 이메일로 문의해주세요.",
  },
};
```

## 지원되는 언어

Clerk는 다음 언어를 지원합니다 (일부):

| 언어 | Language tag (BCP 47) | Key |
|------|----------------------|-----|
| 한국어 | ko-KR | `koKR` |
| 영어 (미국) | en-US | `enUS` |
| 영어 (영국) | en-GB | `enGB` |
| 일본어 | ja-JP | `jaJP` |
| 중국어 (간체) | zh-CN | `zhCN` |
| 중국어 (번체) | zh-TW | `zhTW` |

전체 언어 목록은 [Clerk 공식 문서](https://clerk.com/docs/guides/customizing-clerk/localization#languages)를 참고하세요.

## 에러 메시지 커스터마이징

특정 에러 메시지를 커스터마이징하려면 `unstable__errors` 객체를 수정하세요:

```typescript
export const customKoKR = {
  ...koKR,
  unstable__errors: {
    ...koKR.unstable__errors,
    // 접근이 허용되지 않은 이메일 도메인
    not_allowed_access:
      "접근이 허용되지 않은 이메일입니다. 기업 이메일 도메인을 허용 목록에 추가하려면 이메일로 문의해주세요.",
    
    // 사용자를 찾을 수 없음
    not_found: "사용자를 찾을 수 없습니다.",
    
    // 잘못된 인증 정보
    invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
  },
};
```

사용 가능한 모든 에러 키는 [영어 로컬라이제이션 파일](https://github.com/clerk/javascript/blob/main/packages/localizations/src/en-US.ts)에서 `unstable__errors` 객체를 검색하여 확인할 수 있습니다.

## 컴포넌트별 커스터마이징

특정 컴포넌트의 텍스트를 커스터마이징할 수도 있습니다:

```typescript
export const customKoKR = {
  ...koKR,
  
  signIn: {
    ...koKR.signIn,
    title: "로그인",
    subtitle: "계정에 로그인하세요",
  },
  
  signUp: {
    ...koKR.signUp,
    title: "회원가입",
    subtitle: "새 계정을 만드세요",
  },
};
```

## 주의사항

### 실험적 기능

⚠️ **로컬라이제이션 기능은 현재 실험적(experimental) 상태입니다.** 사용 중 예상치 못한 동작이 발생할 수 있습니다.

### 제한사항

- 로컬라이제이션은 Clerk 컴포넌트(`<SignIn>`, `<SignUp>`, `<UserButton>` 등)의 텍스트만 변경합니다.
- 호스팅된 [Clerk Account Portal](https://clerk.com/docs/guides/customizing-clerk/account-portal)은 영어로 유지됩니다.

## 문제 해결

### 로컬라이제이션이 적용되지 않음

1. `@clerk/localizations` 패키지가 설치되어 있는지 확인
2. `ClerkProvider`에 `localization` prop이 올바르게 전달되었는지 확인
3. 브라우저 캐시를 지우고 다시 시도

### 특정 메시지가 변경되지 않음

1. 로컬라이제이션 객체의 구조가 올바른지 확인
2. 변경하려는 키가 존재하는지 [영어 로컬라이제이션 파일](https://github.com/clerk/javascript/blob/main/packages/localizations/src/en-US.ts)에서 확인

## 참고 자료

- [Clerk 공식 문서: Localization](https://clerk.com/docs/guides/customizing-clerk/localization)
- [영어 로컬라이제이션 파일 (GitHub)](https://github.com/clerk/javascript/blob/main/packages/localizations/src/en-US.ts)
- [@clerk/localizations 패키지 (npm)](https://www.npmjs.com/package/@clerk/localizations)

