/**
 * @file lib/utils/image.ts
 * @description 이미지 최적화 유틸리티 함수
 *
 * 주요 기능:
 * 1. 이미지 URL 검증 및 처리
 * 2. Blur placeholder 데이터 URL 생성
 * 3. 기본 이미지 URL 반환
 */

/**
 * 기본 blur placeholder 데이터 URL
 * 작은 회색 이미지의 base64 인코딩 (1x1 픽셀, 회색)
 */
const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

/**
 * 이미지 URL을 반환 (우선순위: firstimage > firstimage2 > 기본 이미지)
 */
export function getImageUrl(
  firstimage?: string,
  firstimage2?: string,
  fallback?: string
): string {
  if (firstimage) return firstimage;
  if (firstimage2) return firstimage2;
  return fallback || "/images/placeholder-tour.jpg";
}

/**
 * Blur placeholder 데이터 URL 반환
 * Next.js Image 컴포넌트의 placeholder="blur"와 함께 사용
 */
export function getBlurDataURL(): string {
  return BLUR_DATA_URL;
}

/**
 * 이미지 URL이 유효한지 확인
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * 기본 이미지 URL 반환
 */
export function getDefaultImageUrl(): string {
  return "/images/placeholder-tour.jpg";
}

