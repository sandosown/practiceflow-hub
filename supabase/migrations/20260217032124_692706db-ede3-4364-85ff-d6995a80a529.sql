
-- =============================================
-- COMMS MODULE
-- =============================================

-- Announcements
CREATE TABLE public.gp_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_by_profile_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gp_announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read announcements" ON public.gp_announcements FOR SELECT USING (true);
CREATE POLICY "Owner can insert announcements" ON public.gp_announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Owner can update announcements" ON public.gp_announcements FOR UPDATE USING (true);
CREATE POLICY "Owner can delete announcements" ON public.gp_announcements FOR DELETE USING (true);

-- Staff Updates
CREATE TABLE public.gp_staff_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  author_profile_id TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  visibility TEXT NOT NULL DEFAULT 'all' CHECK (visibility IN ('all', 'owner_only')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gp_staff_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read public updates" ON public.gp_staff_updates FOR SELECT USING (true);
CREATE POLICY "Staff can insert updates" ON public.gp_staff_updates FOR INSERT WITH CHECK (true);

-- Resources
CREATE TABLE public.gp_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  category TEXT NOT NULL DEFAULT 'other' CHECK (category IN ('emergency', 'handbook', 'policies', 'procedures', 'other')),
  title TEXT NOT NULL,
  resource_type TEXT NOT NULL DEFAULT 'text' CHECK (resource_type IN ('link', 'text')),
  url TEXT,
  content TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gp_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read resources" ON public.gp_resources FOR SELECT USING (true);
CREATE POLICY "Owner can manage resources" ON public.gp_resources FOR ALL USING (true);

-- Supervision Sessions
CREATE TABLE public.gp_supervision_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  facilitator_profile_id TEXT NOT NULL,
  day_of_week INTEGER NOT NULL DEFAULT 1,
  time TEXT NOT NULL DEFAULT '10:00 AM',
  location_mode TEXT NOT NULL DEFAULT 'virtual' CHECK (location_mode IN ('virtual', 'in_person', 'hybrid')),
  location_detail TEXT,
  notes TEXT
);
ALTER TABLE public.gp_supervision_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read supervision" ON public.gp_supervision_sessions FOR SELECT USING (true);
CREATE POLICY "Owner can manage supervision" ON public.gp_supervision_sessions FOR ALL USING (true);

-- =============================================
-- PEOPLE MODULE
-- =============================================

CREATE TABLE public.gp_worker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  worker_profile_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'changes_requested', 'approved')),
  review_note TEXT,
  reviewed_by_profile_id TEXT,
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  date_of_birth TEXT,
  license_type TEXT,
  caqh_number TEXT,
  npi_number TEXT,
  address TEXT,
  city TEXT,
  county TEXT,
  state TEXT,
  zip_code TEXT,
  populations_served TEXT[] DEFAULT '{}',
  provider_ethnicity TEXT[] DEFAULT '{}'
);
ALTER TABLE public.gp_worker_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read worker profiles" ON public.gp_worker_profiles FOR SELECT USING (true);
CREATE POLICY "Workers can insert own profile" ON public.gp_worker_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Workers can update own profile" ON public.gp_worker_profiles FOR UPDATE USING (true);

-- =============================================
-- OPERATIONS MODULE
-- =============================================

-- Clients
CREATE TABLE public.gp_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  primary_clinician_profile_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gp_clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read clients" ON public.gp_clients FOR SELECT USING (true);
CREATE POLICY "Owner can manage clients" ON public.gp_clients FOR ALL USING (true);

-- Treatment Plan Cycles
CREATE TABLE public.gp_treatment_plan_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  client_id UUID REFERENCES public.gp_clients(id) ON DELETE CASCADE,
  cycle_key TEXT NOT NULL,
  due_date DATE NOT NULL,
  assigned_to_profile_id TEXT,
  state TEXT NOT NULL DEFAULT 'not_started' CHECK (state IN ('not_started', 'started', 'editing', 'done', 'sent_for_approval', 'approved')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by_profile_id TEXT
);
ALTER TABLE public.gp_treatment_plan_cycles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read cycles" ON public.gp_treatment_plan_cycles FOR SELECT USING (true);
CREATE POLICY "Anyone can manage cycles" ON public.gp_treatment_plan_cycles FOR ALL USING (true);

-- Payers (Insurance)
CREATE TABLE public.gp_payers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  payer_name TEXT NOT NULL,
  payer_id TEXT,
  claims_address TEXT,
  submission_deadlines TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  notes TEXT
);
ALTER TABLE public.gp_payers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read payers" ON public.gp_payers FOR SELECT USING (true);
CREATE POLICY "Owner can manage payers" ON public.gp_payers FOR ALL USING (true);

-- Vendors
CREATE TABLE public.gp_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL DEFAULT 'w1',
  vendor_name TEXT NOT NULL,
  main_contact_name TEXT,
  main_contact_phone TEXT,
  main_contact_email TEXT,
  documents_due_date TEXT,
  invoice_submission_window TEXT,
  notes_submission_timeframe TEXT,
  notes TEXT
);
ALTER TABLE public.gp_vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read vendors" ON public.gp_vendors FOR SELECT USING (true);
CREATE POLICY "Owner can manage vendors" ON public.gp_vendors FOR ALL USING (true);
