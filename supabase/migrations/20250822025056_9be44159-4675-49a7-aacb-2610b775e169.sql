-- Drop the overly permissive policy that allows public access to sensitive inspection data
DROP POLICY IF EXISTS "Allow all operations on inspections" ON public.inspections;

-- Create secure RLS policies that require authentication for inspection data
CREATE POLICY "Authenticated users can view inspections" 
ON public.inspections 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create inspections" 
ON public.inspections 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update inspections" 
ON public.inspections 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete inspections" 
ON public.inspections 
FOR DELETE 
TO authenticated 
USING (true);