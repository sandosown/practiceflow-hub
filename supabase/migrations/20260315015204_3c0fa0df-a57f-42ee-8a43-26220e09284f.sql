
CREATE TABLE public.partner_preferences (
  preference_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hat_id TEXT NOT NULL DEFAULT 'w1',
  hidden_modules TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can read own preferences"
  ON public.partner_preferences FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Partners can insert own preferences"
  ON public.partner_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Partners can update own preferences"
  ON public.partner_preferences FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE UNIQUE INDEX partner_preferences_user_hat_idx ON public.partner_preferences (user_id, hat_id);
