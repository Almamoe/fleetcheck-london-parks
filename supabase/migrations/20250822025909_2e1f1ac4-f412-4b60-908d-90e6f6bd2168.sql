-- Drop the overly permissive policy that allows public access to supervisor email addresses
DROP POLICY IF EXISTS "Allow all operations on supervisors" ON public.supervisors;

-- Create secure RLS policies that require authentication for supervisor data
CREATE POLICY "Authenticated users can view supervisors" 
ON public.supervisors 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create supervisors" 
ON public.supervisors 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update supervisors" 
ON public.supervisors 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete supervisors" 
ON public.supervisors 
FOR DELETE 
TO authenticated 
USING (true);