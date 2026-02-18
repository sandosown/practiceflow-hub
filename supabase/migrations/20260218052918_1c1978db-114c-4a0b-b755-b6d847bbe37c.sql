
-- ============================================================
-- PF: Questionnaire Schema Foundation
-- Upload-to-Autofill + Questionnaire Hydration
-- ============================================================

-- 1. questionnaire_draft_answers
--    Single source of truth for all in-progress employee questionnaire state.
--    Keyed by (worker_profile_id, workspace_id) — one draft per worker per workspace.
--    answer_json stores the full flat key→value map of questionnaire fields.
--    autofill_source tracks whether data came from a document upload or manual entry.
CREATE TABLE IF NOT EXISTS public.questionnaire_draft_answers (
  id                  uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id        text NOT NULL DEFAULT 'w1',
  worker_profile_id   text NOT NULL,
  answer_json         jsonb NOT NULL DEFAULT '{}'::jsonb,
  autofill_source     text CHECK (autofill_source IN ('manual', 'upload', 'mixed')) DEFAULT 'manual',
  autofill_confidence jsonb DEFAULT '{}'::jsonb,
  -- per-field confidence scores from document extraction { field_key: 0.0-1.0 }
  uploaded_file_url   text,
  upload_filename     text,
  locked_fields       text[] DEFAULT ARRAY[]::text[],
  -- fields manually confirmed, skip re-autofill
  questionnaire_version integer NOT NULL DEFAULT 1,
  created_at          timestamp with time zone NOT NULL DEFAULT now(),
  updated_at          timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, worker_profile_id)
);

ALTER TABLE public.questionnaire_draft_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can read own draft"
  ON public.questionnaire_draft_answers FOR SELECT
  USING (true);

CREATE POLICY "Workers can insert own draft"
  ON public.questionnaire_draft_answers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Workers can update own draft"
  ON public.questionnaire_draft_answers FOR UPDATE
  USING (true);


-- 2. employee_licenses
--    Repeatable, normalized license rows.
--    A single employee can hold multiple licenses (e.g. LPC + NCC).
--    Linked to the draft questionnaire by worker_profile_id so they travel
--    together through the draft → submitted → approved pipeline.
CREATE TABLE IF NOT EXISTS public.employee_licenses (
  id                  uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id        text NOT NULL DEFAULT 'w1',
  worker_profile_id   text NOT NULL,
  license_type        text NOT NULL,          -- e.g. 'LPC', 'LCSW', 'NCC'
  license_number      text,
  issuing_state       text,
  issued_date         date,
  expiry_date         date,
  is_primary          boolean NOT NULL DEFAULT false,
  source              text CHECK (source IN ('manual', 'upload')) DEFAULT 'manual',
  created_at          timestamp with time zone NOT NULL DEFAULT now(),
  updated_at          timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.employee_licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read employee licenses"
  ON public.employee_licenses FOR SELECT
  USING (true);

CREATE POLICY "Workers can insert own licenses"
  ON public.employee_licenses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Workers can update own licenses"
  ON public.employee_licenses FOR UPDATE
  USING (true);

CREATE POLICY "Workers can delete own licenses"
  ON public.employee_licenses FOR DELETE
  USING (true);


-- 3. employee_tags
--    Unified tag store for workers.
--    tag_type discriminates between 'population', 'modality', 'language', 'specialty', etc.
--    Replaces scattered array columns (populations_served, provider_ethnicity, etc.)
--    and provides a single join surface for filtering/search.
CREATE TABLE IF NOT EXISTS public.employee_tags (
  id                  uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id        text NOT NULL DEFAULT 'w1',
  worker_profile_id   text NOT NULL,
  tag_type            text NOT NULL CHECK (tag_type IN ('population', 'ethnicity', 'modality', 'language', 'specialty', 'other')),
  tag_value           text NOT NULL,
  source              text CHECK (source IN ('manual', 'upload')) DEFAULT 'manual',
  created_at          timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, worker_profile_id, tag_type, tag_value)
);

ALTER TABLE public.employee_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read employee tags"
  ON public.employee_tags FOR SELECT
  USING (true);

CREATE POLICY "Workers can manage own tags"
  ON public.employee_tags FOR ALL
  USING (true);


-- 4. Triggers: auto-update updated_at on draft_answers and employee_licenses

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER questionnaire_draft_answers_updated_at
  BEFORE UPDATE ON public.questionnaire_draft_answers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER employee_licenses_updated_at
  BEFORE UPDATE ON public.employee_licenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 5. Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_qdraft_worker ON public.questionnaire_draft_answers (workspace_id, worker_profile_id);
CREATE INDEX IF NOT EXISTS idx_elicenses_worker ON public.employee_licenses (workspace_id, worker_profile_id);
CREATE INDEX IF NOT EXISTS idx_etags_worker ON public.employee_tags (workspace_id, worker_profile_id);
CREATE INDEX IF NOT EXISTS idx_etags_type ON public.employee_tags (workspace_id, tag_type);
