DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'theme_preference'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN theme_preference text NOT NULL DEFAULT 'light';
  END IF;
END
$$;