
-- Finance entries table (LOG-088)
CREATE TABLE public.finance_entries (
  entry_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hat_id text NOT NULL DEFAULT 'w1',
  engine_source text NOT NULL DEFAULT 'revenue',
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount numeric NOT NULL,
  category text NOT NULL,
  date date NOT NULL,
  notes text,
  source text NOT NULL DEFAULT 'manual',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.finance_entries ENABLE ROW LEVEL SECURITY;

-- Owner+Admin read
CREATE POLICY "Finance entries select for owner/admin"
  ON public.finance_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.role IN ('OWNER', 'ADMIN')
    )
  );

-- Owner+Admin insert
CREATE POLICY "Finance entries insert for owner/admin"
  ON public.finance_entries FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.role IN ('OWNER', 'ADMIN')
    )
  );

-- Owner+Admin update
CREATE POLICY "Finance entries update for owner/admin"
  ON public.finance_entries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.role IN ('OWNER', 'ADMIN')
    )
  );

-- Owner+Admin delete
CREATE POLICY "Finance entries delete for owner/admin"
  ON public.finance_entries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.role IN ('OWNER', 'ADMIN')
    )
  );

-- Finance due items table
CREATE TABLE public.finance_due_items (
  due_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hat_id text NOT NULL DEFAULT 'w1',
  name text NOT NULL,
  amount numeric NOT NULL,
  due_date date NOT NULL,
  category text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.finance_due_items ENABLE ROW LEVEL SECURITY;

-- Owner+Admin read
CREATE POLICY "Due items select for owner/admin"
  ON public.finance_due_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.role IN ('OWNER', 'ADMIN')
    )
  );

-- Owner+Admin insert
CREATE POLICY "Due items insert for owner/admin"
  ON public.finance_due_items FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.role IN ('OWNER', 'ADMIN')
    )
  );

-- Owner+Admin update
CREATE POLICY "Due items update for owner/admin"
  ON public.finance_due_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.role IN ('OWNER', 'ADMIN')
    )
  );

-- Owner+Admin delete
CREATE POLICY "Due items delete for owner/admin"
  ON public.finance_due_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.role IN ('OWNER', 'ADMIN')
    )
  );
