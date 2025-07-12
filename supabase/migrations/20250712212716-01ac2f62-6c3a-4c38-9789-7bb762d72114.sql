-- Remove admin access tables and related policies
DROP TABLE IF EXISTS public.admin_requests CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;