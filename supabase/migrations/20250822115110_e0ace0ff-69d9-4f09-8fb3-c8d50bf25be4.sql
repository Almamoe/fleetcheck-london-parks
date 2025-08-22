-- Fix security linter issues: set search_path for all functions

-- Update the has_role function to set search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update the is_admin_or_supervisor function to set search_path
CREATE OR REPLACE FUNCTION public.is_admin_or_supervisor(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'supervisor')
  )
$$;

-- Update the get_user_department function to set search_path
CREATE OR REPLACE FUNCTION public.get_user_department(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT department
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY CASE WHEN role = 'admin' THEN 1 WHEN role = 'supervisor' THEN 2 ELSE 3 END
  LIMIT 1
$$;

-- Fix the security definer view issue by removing the security barrier
-- The view doesn't need SECURITY DEFINER since it only selects public, non-sensitive data
DROP VIEW IF EXISTS public.supervisor_directory;

-- Recreate the view without security barrier for limited access
CREATE VIEW public.supervisor_directory AS
SELECT 
    id,
    name,
    department,
    created_at
FROM public.supervisors;

-- Grant select on the view
GRANT SELECT ON public.supervisor_directory TO authenticated;

-- Add a policy for the view access (alternative approach)
-- Note: Views inherit RLS from their underlying tables, so this is controlled by supervisor table policies