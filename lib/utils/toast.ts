/**
 * Toast 알림 헬퍼 함수
 *
 * Sonner를 사용한 간편한 토스트 알림 함수들
 * 사용 예시:
 * ```ts
 * import { showToast } from '@/lib/utils/toast';
 *
 * showToast.success('성공했습니다!');
 * showToast.error('오류가 발생했습니다.');
 * showToast.info('정보를 확인하세요.');
 * ```
 */

import { toast } from "sonner";

export const showToast = {
  /**
   * 성공 메시지 토스트
   */
  success: (message: string, description?: string) => {
    return toast.success(message, {
      description,
      duration: 3000,
    });
  },

  /**
   * 에러 메시지 토스트
   */
  error: (message: string, description?: string) => {
    return toast.error(message, {
      description,
      duration: 5000,
    });
  },

  /**
   * 정보 메시지 토스트
   */
  info: (message: string, description?: string) => {
    return toast.info(message, {
      description,
      duration: 3000,
    });
  },

  /**
   * 경고 메시지 토스트
   */
  warning: (message: string, description?: string) => {
    return toast.warning(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * 로딩 토스트 (Promise와 함께 사용)
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Promise 완료 시 자동으로 성공/실패 토스트 표시
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  },
};

// 기본 toast도 export (직접 사용 가능)
export { toast };

