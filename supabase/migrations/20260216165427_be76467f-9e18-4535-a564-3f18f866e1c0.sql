
CREATE TABLE public.operating_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_profile_id UUID NOT NULL UNIQUE,
  domains JSONB NOT NULL DEFAULT '{"practice": true, "coaching": true, "home": true}'::jsonb,
  practice_mode TEXT NOT NULL DEFAULT 'group',
  uses_referrals BOOLEAN NOT NULL DEFAULT true,
  has_staff BOOLEAN NOT NULL DEFAULT true,
  has_interns BOOLEAN NOT NULL DEFAULT true,
  notification_style TEXT NOT NULL DEFAULT 'realtime',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_operating_profiles_owner ON public.operating_profiles(owner_profile_id);

ALTER TABLE public.operating_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own operating profile"
ON public.operating_profiles FOR SELECT
TO authenticated
USING (owner_profile_id = auth.uid());

CREATE POLICY "Users can insert their own operating profile"
ON public.operating_profiles FOR INSERT
TO authenticated
WITH CHECK (owner_profile_id = auth.uid());

CREATE POLICY "Users can update their own operating profile"
ON public.operating_profiles FOR UPDATE
TO authenticated
USING (owner_profile_id = auth.uid());

CREATE OR REPLACE FUNCTION public.update_operating_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_operating_profiles_updated_at
BEFORE UPDATE ON public.operating_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_operating_profiles_updated_at();
