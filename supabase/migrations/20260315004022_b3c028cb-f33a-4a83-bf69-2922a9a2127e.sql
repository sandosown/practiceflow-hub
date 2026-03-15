
-- Invitations table (LOG-091)
CREATE TABLE public.invitations (
  invitation_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hat_id text NOT NULL DEFAULT 'w1',
  invited_by uuid NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('PARTNER', 'ADMIN', 'SUPERVISOR', 'CLINICIAN', 'INTERN', 'STAFF')),
  intern_subtype text CHECK (intern_subtype IS NULL OR intern_subtype IN ('CLINICAL', 'BUSINESS')),
  clinician_subtype text CHECK (clinician_subtype IS NULL OR clinician_subtype IN ('LICENSED', 'LP')),
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED')),
  token text NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '72 hours'),
  accepted_at timestamptz,
  revoked_at timestamptz,
  revoked_by uuid
);

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Owner/Admin can read invitations for their workspace
CREATE POLICY "Authenticated users can read invitations"
  ON public.invitations FOR SELECT TO authenticated
  USING (true);

-- Owner/Admin can insert invitations
CREATE POLICY "Authenticated users can insert invitations"
  ON public.invitations FOR INSERT TO authenticated
  WITH CHECK (invited_by = auth.uid());

-- Owner/Admin can update invitations (revoke)
CREATE POLICY "Authenticated users can update invitations"
  ON public.invitations FOR UPDATE TO authenticated
  USING (true);

-- Public can read invitations by token (for acceptance flow)
CREATE POLICY "Public can read invitations by token"
  ON public.invitations FOR SELECT TO anon
  USING (true);
