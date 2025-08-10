CREATE TABLE IF NOT EXISTS public.profiles (
    user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    is_active boolean NOT NULL DEFAULT true,
    is_profile_complete boolean NOT NULL DEFAULT false,
    account_type text CHECK (account_type IN ('client', 'business')) NOT NULL,
    nit text,
    cc text,
    phone_number text,
    business_type text CHECK (business_type IN ('juridica', 'natural')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
