
-- Practices table
CREATE TABLE public.practices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.practices ENABLE ROW LEVEL SECURITY;

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  practice_id uuid REFERENCES public.practices(id) ON DELETE SET NULL,
  role text NOT NULL DEFAULT 'STAFF',
  clinician_subtype text,
  intern_subtype text,
  onboarding_complete boolean NOT NULL DEFAULT false,
  full_name text,
  email text,
  last_workspace_id uuid REFERENCES public.practices(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('OWNER','ADMIN','SUPERVISOR','CLINICIAN','INTERN','STAFF')),
  CONSTRAINT valid_clinician_subtype CHECK (clinician_subtype IS NULL OR clinician_subtype IN ('LICENSED','LP')),
  CONSTRAINT valid_intern_subtype CHECK (intern_subtype IS NULL OR intern_subtype IN ('CLINICAL','BUSINESS'))
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS: profiles - users can CRUD their own
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS: practices - members can read their practice
CREATE POLICY "Members can read own practice" ON public.practices FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.practice_id = practices.id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Owners can manage practices" ON public.practices FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.practice_id = practices.id AND profiles.user_id = auth.uid() AND profiles.role = 'OWNER')
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
