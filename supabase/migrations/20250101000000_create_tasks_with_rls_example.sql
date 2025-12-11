-- Tasks 테이블 예제 (RLS 정책 포함)
-- 
-- 주의: 이 파일은 프로덕션 환경을 위한 예제입니다.
-- 개발 환경에서는 RLS를 비활성화하는 것이 권장됩니다.
-- 
-- 참고: .cursor/rules/supabase/disable-rls-for-development.mdc 규칙 확인

-- Tasks 테이블 생성
CREATE TABLE IF NOT EXISTS public.tasks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    user_id TEXT NOT NULL DEFAULT (auth.jwt()->>'sub'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.tasks OWNER TO postgres;

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at);

-- 권한 부여
GRANT ALL ON TABLE public.tasks TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE tasks_id_seq TO authenticated;

-- ==========================================
-- 프로덕션 환경에서만 실행: RLS 활성화 및 정책 생성
-- ==========================================

-- RLS 활성화
-- ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 정책 1: 사용자는 자신의 tasks만 조회 가능
-- CREATE POLICY "Users can view their own tasks"
-- ON "public"."tasks"
-- FOR SELECT
-- TO authenticated
-- USING (
--   ((SELECT auth.jwt()->>'sub') = (user_id)::text)
-- );

-- 정책 2: 사용자는 자신의 tasks만 생성 가능
-- CREATE POLICY "Users must insert their own tasks"
-- ON "public"."tasks"
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   ((SELECT auth.jwt()->>'sub') = (user_id)::text)
-- );

-- 정책 3: 사용자는 자신의 tasks만 수정 가능
-- CREATE POLICY "Users can update their own tasks"
-- ON "public"."tasks"
-- FOR UPDATE
-- TO authenticated
-- USING (
--   ((SELECT auth.jwt()->>'sub') = (user_id)::text)
-- )
-- WITH CHECK (
--   ((SELECT auth.jwt()->>'sub') = (user_id)::text)
-- );

-- 정책 4: 사용자는 자신의 tasks만 삭제 가능
-- CREATE POLICY "Users can delete their own tasks"
-- ON "public"."tasks"
-- FOR DELETE
-- TO authenticated
-- USING (
--   ((SELECT auth.jwt()->>'sub') = (user_id)::text)
-- );

-- ==========================================
-- 업데이트 시간 자동 갱신 트리거 함수
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

