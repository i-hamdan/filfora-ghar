-- Create OTP Verifications Table
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  phone text NOT NULL,
  otp_code text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Protect the table
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
-- No public policies! Only Service Role / Edge Functions can read/write to this table for security.
