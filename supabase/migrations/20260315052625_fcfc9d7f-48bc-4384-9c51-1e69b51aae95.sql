
CREATE TABLE public.hat_locations (
  location_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hat_id text NOT NULL DEFAULT 'w1',
  name text NOT NULL,
  address text,
  type text NOT NULL DEFAULT 'office',
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE public.hat_locations ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read locations
CREATE POLICY "Authenticated users can read locations"
  ON public.hat_locations FOR SELECT
  TO authenticated
  USING (true);

-- Owner and Admin can insert locations
CREATE POLICY "Owner and Admin can insert locations"
  ON public.hat_locations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('OWNER', 'ADMIN')
    )
    OR created_by = auth.uid()
  );

-- Owner and Admin can update locations
CREATE POLICY "Owner and Admin can update locations"
  ON public.hat_locations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('OWNER', 'ADMIN')
    )
  );

-- Owner and Admin can delete locations
CREATE POLICY "Owner and Admin can delete locations"
  ON public.hat_locations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('OWNER', 'ADMIN')
    )
  );
