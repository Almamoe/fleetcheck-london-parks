-- Allow public access to supervisors table for inspection submissions
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can create supervisors" ON public.supervisors;
DROP POLICY IF EXISTS "Admins can delete supervisors" ON public.supervisors;
DROP POLICY IF EXISTS "Admins can update supervisors" ON public.supervisors;
DROP POLICY IF EXISTS "Admins and supervisors can view supervisors" ON public.supervisors;

-- Create new public access policies
CREATE POLICY "Allow public read access to supervisors" 
ON public.supervisors 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to supervisors" 
ON public.supervisors 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to supervisors" 
ON public.supervisors 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access to supervisors" 
ON public.supervisors 
FOR DELETE 
USING (true);