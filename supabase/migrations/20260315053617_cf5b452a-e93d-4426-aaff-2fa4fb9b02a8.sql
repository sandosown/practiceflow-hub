
DROP POLICY "Authenticated users can read locations" ON public.hat_locations;
CREATE POLICY "Anyone can read locations"
  ON public.hat_locations FOR SELECT
  TO public
  USING (true);
