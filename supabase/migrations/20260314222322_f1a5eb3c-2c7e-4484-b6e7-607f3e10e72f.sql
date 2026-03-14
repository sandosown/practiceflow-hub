
CREATE TABLE public.finance_custom_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  modal_type text NOT NULL,
  category_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, modal_type, category_name)
);

ALTER TABLE public.finance_custom_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own custom categories"
  ON public.finance_custom_categories FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own custom categories"
  ON public.finance_custom_categories FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own custom categories"
  ON public.finance_custom_categories FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
