-- Fix the security definer view issue
DROP VIEW IF EXISTS public.supervisor_directory;

-- Create the view without SECURITY DEFINER
CREATE VIEW public.supervisor_directory AS
SELECT 
  id,
  name,
  department,
  created_at
FROM public.supervisors;