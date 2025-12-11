/**
 * @file Instruments Example Page
 * @description Supabase 공식 문서 예제: Instruments 데이터 조회
 * 
 * 이 페이지는 Supabase 공식 문서의 Next.js 퀵스타트 가이드를 기반으로 작성되었습니다.
 * https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 * 
 * 주요 기능:
 * 1. Server Component에서 Supabase 데이터 조회
 * 2. Suspense를 사용한 로딩 상태 처리
 * 3. Clerk + Supabase 통합 사용
 * 
 * @dependencies
 * - lib/supabase/server: createClient (Server Component용)
 * - react: Suspense
 */

import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import Link from "next/link";

interface Instrument {
  id: number;
  name: string;
}

async function InstrumentsData() {
  const supabase = await createClient();
  const { data: instruments, error } = await supabase
    .from("instruments")
    .select();

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-semibold text-red-800 mb-2">에러 발생</h3>
        <p className="text-sm text-red-700">{error.message}</p>
        <p className="text-xs text-red-600 mt-2">
          💡 <strong>해결 방법:</strong>
          <br />
          1. Supabase Dashboard에서 <code>instruments</code> 테이블이 생성되었는지 확인
          <br />
          2. 환경 변수가 올바르게 설정되었는지 확인
          <br />
          3. RLS 정책이 올바르게 설정되었는지 확인 (개발 환경에서는 RLS 비활성화 권장)
        </p>
      </div>
    );
  }

  if (!instruments || instruments.length === 0) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">
          데이터가 없습니다
        </h3>
        <p className="text-sm text-yellow-700">
          Supabase Dashboard의 SQL Editor에서 다음 SQL을 실행하여 샘플 데이터를 추가하세요:
        </p>
        <pre className="mt-2 p-4 bg-white border rounded text-xs overflow-x-auto">
          {`-- Create the table
CREATE TABLE IF NOT EXISTS instruments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL
);

-- Insert sample data
INSERT INTO instruments (name)
VALUES ('violin'), ('viola'), ('cello');

-- Make data publicly readable (for development)
ALTER TABLE instruments DISABLE ROW LEVEL SECURITY;`}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Instruments 목록</h2>
      <ul className="space-y-2">
        {instruments.map((instrument: Instrument) => (
          <li
            key={instrument.id}
            className="p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{instrument.name}</p>
                <p className="text-xs text-gray-500">ID: {instrument.id}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold mb-2">💡 이 페이지의 작동 원리</h3>
        <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
          <li>
            Server Component에서 <code>createClient</code>를 사용하여 Supabase에
            연결합니다
          </li>
          <li>
            Next.js 15 App Router의 <code>Suspense</code>를 사용하여 로딩 상태를
            처리합니다
          </li>
          <li>
            Clerk 인증이 활성화되어 있으면, 인증 토큰이 자동으로 Supabase 요청에
            포함됩니다
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function Instruments() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← 홈으로 돌아가기
        </Link>
        <h1 className="text-4xl font-bold mb-2">Instruments 예제</h1>
        <p className="text-gray-600">
          Supabase 공식 문서 예제를 기반으로 한 데이터 조회 데모
        </p>
      </div>

      <Suspense
        fallback={
          <div className="p-8 text-center text-gray-500">
            <p>Loading instruments...</p>
          </div>
        }
      >
        <InstrumentsData />
      </Suspense>
    </div>
  );
}

