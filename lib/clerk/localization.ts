/**
 * @file Clerk 한국어 로컬라이제이션 설정
 * @description Clerk 컴포넌트를 한국어로 커스터마이징하기 위한 설정
 * 
 * 공식 문서 참고:
 * https://clerk.com/docs/guides/customizing-clerk/localization
 * 
 * 기본 한국어 로컬라이제이션을 확장하여 커스텀 메시지를 추가할 수 있습니다.
 */

import { koKR } from "@clerk/localizations";

/**
 * 커스텀 한국어 로컬라이제이션
 * 
 * 기본 koKR 로컬라이제이션을 기반으로 특정 메시지를 커스터마이징할 수 있습니다.
 * 
 * @example
 * ```typescript
 * import { customKoKR } from '@/lib/clerk/localization';
 * 
 * // app/layout.tsx
 * <ClerkProvider localization={customKoKR}>
 *   {children}
 * </ClerkProvider>
 * ```
 */
export const customKoKR = {
  ...koKR,
  
  // 에러 메시지 커스터마이징
  unstable__errors: {
    ...koKR.unstable__errors,
    // 접근이 허용되지 않은 이메일 도메인일 때
    not_allowed_access:
      "접근이 허용되지 않은 이메일입니다. 기업 이메일 도메인을 허용 목록에 추가하려면 이메일로 문의해주세요.",
    
    // 필요한 경우 추가 에러 메시지 커스터마이징
    // not_found: "사용자를 찾을 수 없습니다.",
    // invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
  },

  // 특정 컴포넌트의 텍스트 커스터마이징 예제 (필요시 사용)
  // signIn: {
  //   ...koKR.signIn,
  //   title: "로그인",
  //   subtitle: "계정에 로그인하세요",
  // },
  
  // signUp: {
  //   ...koKR.signUp,
  //   title: "회원가입",
  //   subtitle: "새 계정을 만드세요",
  // },
};

/**
 * 기본 한국어 로컬라이제이션 (커스터마이징 없음)
 * 
 * 기본 제공되는 한국어 로컬라이제이션을 그대로 사용합니다.
 */
export { koKR };

