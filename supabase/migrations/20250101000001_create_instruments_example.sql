-- Instruments 테이블 예제 (Supabase 공식 문서 퀵스타트)
-- 
-- 이 마이그레이션은 Supabase 공식 문서의 Next.js 퀵스타트 가이드를 기반으로 작성되었습니다.
-- 참고: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
--
-- 주의: 개발 환경에서는 RLS를 비활성화하는 것이 권장됩니다.
-- 참고: .cursor/rules/supabase/disable-rls-for-development.mdc 규칙 확인

-- Instruments 테이블 생성
CREATE TABLE IF NOT EXISTS public.instruments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.instruments OWNER TO postgres;

-- 샘플 데이터 삽입
INSERT INTO public.instruments (name)
VALUES ('violin'), ('viola'), ('cello')
ON CONFLICT DO NOTHING;

-- 권한 부여
GRANT ALL ON TABLE public.instruments TO anon;
GRANT ALL ON TABLE public.instruments TO authenticated;
GRANT ALL ON TABLE public.instruments TO service_role;

-- ==========================================
-- 개발 환경: RLS 비활성화
-- ==========================================
ALTER TABLE public.instruments DISABLE ROW LEVEL SECURITY;

-- ==========================================
-- 프로덕션 환경용 RLS 정책 (주석 처리됨)
-- ==========================================

-- 공개 데이터 읽기 정책 (개발/테스트용)
-- ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "public can read instruments"
-- ON public.instruments
-- FOR SELECT
-- TO anon
-- USING (true);

