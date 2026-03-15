
CREATE TABLE public.appointments (
  appointment_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hat_id TEXT NOT NULL DEFAULT 'w1',
  engine_source TEXT NOT NULL DEFAULT 'operations',
  title TEXT NOT NULL,
  appointment_type TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID NOT NULL,
  assigned_to UUID NOT NULL,
  assigned_by UUID,
  client_id UUID,
  supervision_session_id UUID,
  notes TEXT,
  needs_reschedule BOOLEAN NOT NULL DEFAULT false,
  reschedule_requested_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read appointments (visibility filtering done in app layer)
CREATE POLICY "Authenticated users can read appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert appointments
CREATE POLICY "Authenticated users can insert appointments"
  ON public.appointments FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Users can update their own appointments or appointments they created for others
CREATE POLICY "Users can update own appointments"
  ON public.appointments FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR assigned_to = auth.uid());

-- Users can delete their own appointments (not supervisor-assigned)
CREATE POLICY "Users can delete own appointments"
  ON public.appointments FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());
