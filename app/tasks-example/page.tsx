/**
 * @file Tasks Example Page
 * @description Clerk + Supabase 통합 예제: Tasks 관리
 * 
 * 이 페이지는 Clerk와 Supabase 네이티브 통합을 사용하여
 * 사용자별 Tasks를 관리하는 예제를 보여줍니다.
 * 
 * 주요 기능:
 * 1. Clerk 인증 확인
 * 2. Supabase에서 사용자의 tasks 조회
 * 3. 새 task 생성
 * 4. task 삭제
 * 
 * RLS 정책:
 * - 사용자는 자신의 tasks만 조회/생성/삭제 가능
 * - auth.jwt()->>'sub' (Clerk user ID)로 접근 제어
 * 
 * @dependencies
 * - @clerk/nextjs: useUser, useSession
 * - @supabase/supabase-js: Supabase 클라이언트
 * - lib/supabase/clerk-client: useClerkSupabaseClient
 */

"use client";

import { useState, useEffect } from "react";
import { useUser, useSession } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Task {
  id: number;
  name: string;
  user_id: string;
  created_at: string;
}

export default function TasksExamplePage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { session, isLoaded: sessionLoaded } = useSession();
  const supabase = useClerkSupabaseClient();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Tasks 로드
  const loadTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        // 테이블이 없을 수 있음
        if (fetchError.code === "42P01") {
          setError(
            "tasks 테이블이 아직 생성되지 않았습니다. Supabase Dashboard에서 마이그레이션을 실행하세요."
          );
        } else {
          throw fetchError;
        }
        return;
      }

      setTasks(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Tasks를 불러오는 중 오류가 발생했습니다."
      );
      console.error("Load tasks error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Task 생성
  const createTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newTaskName.trim() || !user) return;

    try {
      setError(null);

      // user_id는 기본값으로 auth.jwt()->>'sub'가 설정되지만,
      // 명시적으로 지정하는 것이 더 안전합니다.
      const { data, error: insertError } = await supabase
        .from("tasks")
        .insert({
          name: newTaskName.trim(),
          user_id: user.id, // Clerk user ID
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setTasks((prev) => [data, ...prev]);
      setNewTaskName("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Task 생성 중 오류가 발생했습니다."
      );
      console.error("Create task error:", err);
    }
  };

  // Task 삭제
  const deleteTask = async (taskId: number) => {
    if (!user) return;

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId)
        .eq("user_id", user.id); // RLS 정책과 함께 이중 체크

      if (deleteError) throw deleteError;

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Task 삭제 중 오류가 발생했습니다."
      );
      console.error("Delete task error:", err);
    }
  };

  useEffect(() => {
    if (userLoaded && sessionLoaded && user && session) {
      loadTasks();
    }
  }, [userLoaded, sessionLoaded, user, session, loadTasks]);

  if (!userLoaded || !sessionLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">로그인이 필요합니다</h1>
        <p className="text-gray-600">
          Tasks를 관리하려면 먼저 로그인해주세요.
        </p>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← 홈으로 돌아가기
        </Link>
        <h1 className="text-4xl font-bold mb-2">Tasks 관리 예제</h1>
        <p className="text-gray-600">
          Clerk + Supabase 네이티브 통합을 사용한 사용자별 Tasks 관리
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-1">에러</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* 새 Task 생성 폼 */}
      <div className="mb-8 p-6 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-bold mb-4">새 Task 추가</h2>
        <form onSubmit={createTask} className="flex gap-2">
          <Input
            type="text"
            placeholder="Task 이름 입력"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !newTaskName.trim()}>
            추가
          </Button>
        </form>
      </div>

      {/* Tasks 목록 */}
      <div className="border rounded-lg">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">내 Tasks</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={loadTasks}
              disabled={loading}
            >
              {loading ? "로딩 중..." : "새로고침"}
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            총 {tasks.length}개의 task가 있습니다.
          </p>
        </div>

        <div className="p-6">
          {loading && tasks.length === 0 ? (
            <div className="py-8 text-center text-gray-500">로딩 중...</div>
          ) : tasks.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>아직 task가 없습니다.</p>
              <p className="text-sm mt-2">위 폼을 사용하여 새 task를 추가하세요.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-medium">{task.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      생성: {new Date(task.created_at).toLocaleString("ko-KR")}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    disabled={loading}
                  >
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 정보 박스 */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold mb-2">💡 이 예제의 작동 원리</h3>
        <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
          <li>
            <code>useClerkSupabaseClient()</code> 훅이 Clerk 세션 토큰을 자동으로
            Supabase 요청에 포함합니다
          </li>
          <li>
            Supabase의 RLS 정책이 <code>auth.jwt()-&gt;&gt;&apos;sub&apos;</code> (Clerk user
            ID)를 확인하여 사용자가 자신의 tasks만 접근할 수 있도록 제한합니다
          </li>
          <li>
            다른 사용자로 로그인하면 해당 사용자의 tasks만 보입니다 (RLS 활성화 시)
          </li>
          <li>
            테이블 생성:{" "}
            <code>supabase/migrations/20250101000000_create_tasks_with_rls_example.sql</code>{" "}
            파일 참고
          </li>
        </ul>
      </div>
    </div>
  );
}

