-- Update RLS policies for inspections table to allow public access
-- This allows the fleet inspection app to work without requiring individual user authentication

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can view inspections" ON public.inspections;
DROP POLICY IF EXISTS "Authenticated users can create inspections" ON public.inspections;
DROP POLICY IF EXISTS "Authenticated users can update inspections" ON public.inspections;
DROP POLICY IF EXISTS "Authenticated users can delete inspections" ON public.inspections;

-- Create new public access policies
CREATE POLICY "Allow public read access to inspections" 
ON public.inspections 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to inspections" 
ON public.inspections 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to inspections" 
ON public.inspections 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access to inspections" 
ON public.inspections 
FOR DELETE 
USING (true);