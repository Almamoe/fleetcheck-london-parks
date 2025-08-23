-- Allow public access to drivers table for inspection submissions  
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can create drivers" ON public.drivers;
DROP POLICY IF EXISTS "Authenticated users can delete drivers" ON public.drivers;
DROP POLICY IF EXISTS "Authenticated users can update drivers" ON public.drivers;
DROP POLICY IF EXISTS "Authenticated users can view drivers" ON public.drivers;

-- Create new public access policies
CREATE POLICY "Allow public read access to drivers" 
ON public.drivers 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to drivers" 
ON public.drivers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to drivers" 
ON public.drivers 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access to drivers" 
ON public.drivers 
FOR DELETE 
USING (true);