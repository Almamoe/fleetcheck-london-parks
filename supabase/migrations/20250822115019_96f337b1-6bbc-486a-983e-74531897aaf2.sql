-- Create a user roles system to properly secure supervisor access
-- This addresses the security finding about employee data exposure

-- First, create an enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'supervisor', 'driver', 'user');

-- Create a user_roles table to manage user permissions
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    department text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on the user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check user roles
-- This prevents recursive RLS issues
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create a function to check if user is admin or supervisor
CREATE OR REPLACE FUNCTION public.is_admin_or_supervisor(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'supervisor')
  )
$$;

-- Create a function to get user's department
CREATE OR REPLACE FUNCTION public.get_user_department(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT department
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY CASE WHEN role = 'admin' THEN 1 WHEN role = 'supervisor' THEN 2 ELSE 3 END
  LIMIT 1
$$;

-- Create RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Now update the supervisors table policies to implement proper access control
-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view supervisors" ON public.supervisors;
DROP POLICY IF EXISTS "Authenticated users can create supervisors" ON public.supervisors;
DROP POLICY IF EXISTS "Authenticated users can update supervisors" ON public.supervisors;
DROP POLICY IF EXISTS "Authenticated users can delete supervisors" ON public.supervisors;

-- Create secure role-based policies for supervisors
-- Only admins and supervisors can view supervisor data
CREATE POLICY "Admins and supervisors can view supervisors"
ON public.supervisors
FOR SELECT
TO authenticated
USING (public.is_admin_or_supervisor(auth.uid()));

-- Only admins can create new supervisors
CREATE POLICY "Admins can create supervisors"
ON public.supervisors
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update supervisor data
CREATE POLICY "Admins can update supervisors"
ON public.supervisors
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete supervisors
CREATE POLICY "Admins can delete supervisors"
ON public.supervisors
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create a view for limited supervisor data that can be accessed by drivers
-- This allows drivers to see supervisor names without sensitive email data
CREATE VIEW public.supervisor_directory AS
SELECT 
    id,
    name,
    department,
    created_at
FROM public.supervisors;

-- Grant access to the view
GRANT SELECT ON public.supervisor_directory TO authenticated;

-- Create RLS for the view
ALTER VIEW public.supervisor_directory SET (security_barrier = true);

-- Insert a default admin user (this should be customized based on your needs)
-- Note: This will only work if there's an authenticated user with this email
-- You'll need to create this user in Supabase Auth first
INSERT INTO public.user_roles (user_id, role, department)
SELECT 
    auth.uid(),
    'admin'::app_role,
    'Administration'
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;