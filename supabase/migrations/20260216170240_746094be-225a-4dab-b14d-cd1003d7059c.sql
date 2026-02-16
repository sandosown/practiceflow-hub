
ALTER TABLE public.operating_profiles
  ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS domain_labels JSONB NOT NULL DEFAULT '{"GROUP_PRACTICE":"Group Practice","COACHING":"Coaching Business","HOME":"Home"}'::jsonb,
  ADD COLUMN IF NOT EXISTS domain_priority TEXT[] NOT NULL DEFAULT ARRAY['GROUP_PRACTICE']::text[],
  ADD COLUMN IF NOT EXISTS notifications_pref TEXT NOT NULL DEFAULT 'MEDIUM';

-- Update domains column default to new format (string array stored as jsonb)
ALTER TABLE public.operating_profiles
  ALTER COLUMN domains SET DEFAULT '["GROUP_PRACTICE"]'::jsonb;
