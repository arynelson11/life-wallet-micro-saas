-- FORCE FIX: Profile RLS and Storage
-- Run this in Supabase SQL Editor

-- 1. PROFILES RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to be safe
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create basic Update/Select policies
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can view all profiles"
ON public.profiles
FOR SELECT
USING (true);

-- 2. STORAGE (Avatars)
-- Create bucket if not exists (using upsert logic equivalent)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Avatar Upload Policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Select Policy" ON storage.objects;
DROP POLICY IF EXISTS "Give me access" ON storage.objects;

-- Create Permissive Policies for Avatars
CREATE POLICY "Avatar Upload Policy" ON storage.objects
FOR INSERT 
WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

CREATE POLICY "Avatar Update Policy" ON storage.objects
FOR UPDATE
WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

CREATE POLICY "Avatar Select Policy" ON storage.objects
FOR SELECT 
USING ( bucket_id = 'avatars' );
