
CREATE TABLE public.permission_grants (
  grant_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hat_id text NOT NULL DEFAULT 'w1'::text,
  granted_by uuid NOT NULL,
  granted_to uuid NOT NULL,
  module text NOT NULL,
  access_type text NOT NULL DEFAULT 'view'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  revoked_at timestamp with time zone,
  revoked_by uuid,
  is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE public.permission_grants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read grants"
ON public.permission_grants
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert grants"
ON public.permission_grants
FOR INSERT
TO authenticated
WITH CHECK (granted_by = auth.uid());

CREATE POLICY "Authenticated users can update grants"
ON public.permission_grants
FOR UPDATE
TO authenticated
USING (true);
