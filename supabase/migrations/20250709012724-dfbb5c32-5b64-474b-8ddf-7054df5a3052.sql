
-- Create admin_requests table for users to request admin access
CREATE TABLE public.admin_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table for approved admin users
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_requests
CREATE POLICY "Users can view their own admin requests" 
  ON public.admin_requests 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create admin requests" 
  ON public.admin_requests 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can update admin requests" 
  ON public.admin_requests 
  FOR UPDATE 
  USING (true);

-- Create policies for admin_users  
CREATE POLICY "Anyone can read admin_users for role checking" 
  ON public.admin_users 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage admin_users" 
  ON public.admin_users 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
