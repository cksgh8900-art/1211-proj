"use server";

/**
 * @file actions/bookmarks.ts
 * @description 북마크 관련 Server Actions
 *
 * 주요 기능:
 * 1. 북마크 조회 (getBookmark)
 * 2. 북마크 추가 (addBookmark)
 * 3. 북마크 제거 (removeBookmark)
 * 4. 사용자 북마크 목록 조회 (getUserBookmarks)
 *
 * @dependencies
 * - @clerk/nextjs/server: auth
 * - lib/supabase/server: createClient
 */

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Clerk user ID로 Supabase users 테이블의 user_id 조회
 */
async function getSupabaseUserId(): Promise<string | null> {
  const authInstance = await auth();
  const clerkUserId = authInstance.userId;

  if (!clerkUserId) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkUserId)
    .single();

  if (error || !data) {
    console.error("Supabase user 조회 실패:", error);
    return null;
  }

  return data.id;
}

/**
 * 북마크 조회
 * 
 * @param contentId - 관광지 contentId
 * @returns 북마크 여부 (true: 북마크됨, false: 북마크 안됨)
 */
export async function getBookmark(contentId: string): Promise<boolean> {
  const userId = await getSupabaseUserId();
  if (!userId) return false;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("content_id", contentId)
    .single();

  // 에러가 발생하거나 데이터가 없으면 북마크되지 않은 것으로 간주
  if (error) {
    // PGRST116: 단일 행을 찾을 수 없음 (정상적인 경우)
    if (error.code === "PGRST116") {
      return false;
    }
    console.error("북마크 조회 실패:", error);
    return false;
  }

  return !!data;
}

/**
 * 북마크 추가
 * 
 * @param contentId - 관광지 contentId
 * @returns 성공 여부 및 에러 메시지
 */
export async function addBookmark(
  contentId: string
): Promise<{ success: boolean; error?: string }> {
  const userId = await getSupabaseUserId();
  if (!userId) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("bookmarks").insert({
    user_id: userId,
    content_id: contentId,
  });

  if (error) {
    // UNIQUE 제약 위반 (이미 북마크된 경우)
    if (error.code === "23505") {
      return { success: false, error: "이미 북마크된 관광지입니다." };
    }
    console.error("북마크 추가 실패:", error);
    return { success: false, error: "북마크 추가에 실패했습니다." };
  }

  return { success: true };
}

/**
 * 북마크 제거
 * 
 * @param contentId - 관광지 contentId
 * @returns 성공 여부 및 에러 메시지
 */
export async function removeBookmark(
  contentId: string
): Promise<{ success: boolean; error?: string }> {
  const userId = await getSupabaseUserId();
  if (!userId) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", userId)
    .eq("content_id", contentId);

  if (error) {
    console.error("북마크 제거 실패:", error);
    return { success: false, error: "북마크 제거에 실패했습니다." };
  }

  return { success: true };
}

/**
 * 사용자 북마크 목록 조회
 * 
 * @returns 북마크된 관광지 contentId 배열
 */
export async function getUserBookmarks(): Promise<string[]> {
  const userId = await getSupabaseUserId();
  if (!userId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("content_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("북마크 목록 조회 실패:", error);
    return [];
  }

  return data.map((item) => item.content_id);
}

/**
 * 북마크된 관광지의 상세 정보 조회
 * 
 * @returns 북마크된 관광지 목록 및 북마크 생성일시
 */
export async function getBookmarkedTours(): Promise<{
  tours: import("@/lib/types/tour").TourItem[];
  bookmarkDates: Map<string, string>;
}> {
  const userId = await getSupabaseUserId();
  if (!userId) {
    return { tours: [], bookmarkDates: new Map() };
  }

  const supabase = await createClient();
  
  // 북마크 목록 조회 (contentId와 created_at 포함)
  const { data: bookmarks, error } = await supabase
    .from("bookmarks")
    .select("content_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !bookmarks || bookmarks.length === 0) {
    if (error) {
      console.error("북마크 목록 조회 실패:", error);
    }
    return { tours: [], bookmarkDates: new Map() };
  }

  // 북마크 생성일시 Map 생성
  const bookmarkDates = new Map<string, string>();
  bookmarks.forEach((bookmark) => {
    bookmarkDates.set(bookmark.content_id, bookmark.created_at);
  });

  // 각 contentId에 대해 관광지 정보 조회 (병렬 처리)
  const { getDetailCommon } = await import("@/lib/api/tour-api");
  const tourPromises = bookmarks.map(async (bookmark) => {
    try {
      const detail = await getDetailCommon({
        contentId: bookmark.content_id,
        defaultYN: "Y",
        firstImageYN: "Y",
        addrinfoYN: "Y",
        mapinfoYN: "Y",
        overviewYN: "N", // 목록에서는 개요 불필요
      });

      // TourDetail을 TourItem 형태로 변환
      const tourItem: import("@/lib/types/tour").TourItem = {
        contentid: detail.contentid,
        contenttypeid: detail.contenttypeid,
        title: detail.title,
        addr1: detail.addr1,
        addr2: detail.addr2,
        areacode: detail.areacode,
        sigungucode: detail.sigungucode,
        mapx: detail.mapx,
        mapy: detail.mapy,
        firstimage: detail.firstimage,
        firstimage2: detail.firstimage2,
        tel: detail.tel,
        cat1: detail.cat1,
        cat2: detail.cat2,
        cat3: detail.cat3,
        createdtime: detail.createdtime,
        modifiedtime: detail.modifiedtime || detail.createdtime || "",
        zipcode: detail.zipcode,
        mlevel: detail.mlevel,
      };

      return tourItem;
    } catch (err) {
      console.error(
        `관광지 정보 조회 실패 (contentId: ${bookmark.content_id}):`,
        err
      );
      return null;
    }
  });

  // 모든 Promise 실행 (일부 실패해도 계속 진행)
  const tourResults = await Promise.all(tourPromises);
  
  // null 제거 (실패한 항목 필터링)
  const tours = tourResults.filter(
    (tour): tour is import("@/lib/types/tour").TourItem => tour !== null
  );

  return { tours, bookmarkDates };
}

