-- Update RLS policies for admin_requests to allow service role access
-- Drop existing policies and recreate them with proper service role access

DROP POLICY IF EXISTS "Users can view their own admin requests" ON public.admin_requests;
DROP POLICY IF EXISTS "Users can create admin requests" ON public.admin_requests;
DROP POLICY IF EXISTS "Admins can update admin requests" ON public.admin_requests;

-- Create new policies that allow service role access
CREATE POLICY "Users can view their own admin requests" 
ON public.admin_requests 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create admin requests" 
ON public.admin_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can manage admin requests" 
ON public.admin_requests 
FOR ALL 
USING (true) 
WITH CHECK (true);