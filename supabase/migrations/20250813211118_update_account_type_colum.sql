ALTER TABLE public.profiles
DROP CONSTRAINT profiles_account_type_check;

ALTER TABLE public.profiles ADD CONSTRAINT profiles_account_type_check CHECK (account_type IN ('client', 'business', 'both'));