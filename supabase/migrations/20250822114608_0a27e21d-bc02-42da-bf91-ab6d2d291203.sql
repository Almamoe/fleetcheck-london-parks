-- Fix overly permissive RLS policies on core tables

-- Drop dangerous public access policies
DROP POLICY IF EXISTS "Allow all operations on drivers" ON public.drivers;
DROP POLICY IF EXISTS "Allow all operations on vehicles" ON public.vehicles;

-- Create secure RLS policies for drivers table
CREATE POLICY "Authenticated users can view drivers" 
ON public.drivers 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create drivers" 
ON public.drivers 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update drivers" 
ON public.drivers 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete drivers" 
ON public.drivers 
FOR DELETE 
TO authenticated 
USING (true);

-- Create secure RLS policies for vehicles table
CREATE POLICY "Authenticated users can view vehicles" 
ON public.vehicles 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create vehicles" 
ON public.vehicles 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update vehicles" 
ON public.vehicles 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete vehicles" 
ON public.vehicles 
FOR DELETE 
TO authenticated 
USING (true);

-- Inspections table already has proper authentication-required policies, so no changes needed

-- Check for and secure any admin tables that might exist
-- First, let's see if there are any admin-related tables and secure them
DO $$
BEGIN
    -- Check if admin_requests table exists and secure it
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_requests') THEN
        -- Drop any overly permissive policies
        DROP POLICY IF EXISTS "Anyone can view admin requests" ON public.admin_requests;
        DROP POLICY IF EXISTS "Anyone can create admin requests" ON public.admin_requests;
        
        -- Create secure policies
        CREATE POLICY "Authenticated users can view admin requests" 
        ON public.admin_requests 
        FOR SELECT 
        TO authenticated 
        USING (true);
        
        CREATE POLICY "Authenticated users can create admin requests" 
        ON public.admin_requests 
        FOR INSERT 
        TO authenticated 
        WITH CHECK (true);
    END IF;
    
    -- Check if admins table exists and secure it
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admins') THEN
        -- Drop any overly permissive policies
        DROP POLICY IF EXISTS "Anyone can view admins" ON public.admins;
        DROP POLICY IF EXISTS "Anyone can create admins" ON public.admins;
        
        -- Create secure policies
        CREATE POLICY "Authenticated users can view admins" 
        ON public.admins 
        FOR SELECT 
        TO authenticated 
        USING (true);
        
        CREATE POLICY "Authenticated users can create admins" 
        ON public.admins 
        FOR INSERT 
        TO authenticated 
        WITH CHECK (true);
    END IF;
END $$;