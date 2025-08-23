-- Remove existing RLS policies on vehicles table
DROP POLICY IF EXISTS "Authenticated users can view vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Authenticated users can create vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Authenticated users can update vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Authenticated users can delete vehicles" ON public.vehicles;

-- Create new policies that allow public access
CREATE POLICY "Allow public read access to vehicles" 
ON public.vehicles FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to vehicles" 
ON public.vehicles FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to vehicles" 
ON public.vehicles FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access to vehicles" 
ON public.vehicles FOR DELETE 
USING (true);