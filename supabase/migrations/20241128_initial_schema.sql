-- LifeWallet Database Schema
-- Migration: Initial schema with shared spaces support

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE (Extension of auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. SPACES TABLE (Where money "lives")
-- =====================================================
CREATE TABLE IF NOT EXISTS public.spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('PERSONAL', 'COUPLE', 'FAMILY')),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on spaces
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;

-- Spaces RLS Policies
CREATE POLICY "Users can view spaces they are members of"
  ON public.spaces FOR SELECT
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.space_members
      WHERE space_members.space_id = spaces.id
      AND space_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can update their spaces"
  ON public.spaces FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Users can create spaces"
  ON public.spaces FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can delete their spaces"
  ON public.spaces FOR DELETE
  USING (owner_id = auth.uid());

-- =====================================================
-- 3. SPACE_MEMBERS TABLE (Access control)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.space_members (
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (space_id, user_id)
);

-- Enable RLS on space_members
ALTER TABLE public.space_members ENABLE ROW LEVEL SECURITY;

-- Space Members RLS Policies
CREATE POLICY "Users can view members of their spaces"
  ON public.space_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE spaces.id = space_members.space_id
      AND (spaces.owner_id = auth.uid() OR space_members.user_id = auth.uid())
    )
  );

CREATE POLICY "Space admins can add members"
  ON public.space_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE spaces.id = space_id
      AND spaces.owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.space_members
      WHERE space_members.space_id = space_id
      AND space_members.user_id = auth.uid()
      AND space_members.role = 'admin'
    )
  );

CREATE POLICY "Space admins can remove members"
  ON public.space_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE spaces.id = space_id
      AND spaces.owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.space_members
      WHERE space_members.space_id = space_id
      AND space_members.user_id = auth.uid()
      AND space_members.role = 'admin'
    )
  );

-- =====================================================
-- 4. TRANSACTIONS TABLE (Financial flow)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_space_id ON public.transactions(space_id);
CREATE INDEX IF NOT EXISTS idx_transactions_profile_id ON public.transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);

-- Enable RLS on transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Transactions RLS Policies
CREATE POLICY "Users can view transactions in their spaces"
  ON public.transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.space_members
      WHERE space_members.space_id = transactions.space_id
      AND space_members.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE spaces.id = transactions.space_id
      AND spaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Space members can create transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (
    profile_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM public.space_members
        WHERE space_members.space_id = transactions.space_id
        AND space_members.user_id = auth.uid()
      ) OR
      EXISTS (
        SELECT 1 FROM public.spaces
        WHERE spaces.id = transactions.space_id
        AND spaces.owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update their own transactions"
  ON public.transactions FOR UPDATE
  USING (
    profile_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM public.space_members
        WHERE space_members.space_id = transactions.space_id
        AND space_members.user_id = auth.uid()
      ) OR
      EXISTS (
        SELECT 1 FROM public.spaces
        WHERE spaces.id = transactions.space_id
        AND spaces.owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete their own transactions"
  ON public.transactions FOR DELETE
  USING (
    profile_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM public.space_members
        WHERE space_members.space_id = transactions.space_id
        AND space_members.user_id = auth.uid()
      ) OR
      EXISTS (
        SELECT 1 FROM public.spaces
        WHERE spaces.id = transactions.space_id
        AND spaces.owner_id = auth.uid()
      )
    )
  );

-- =====================================================
-- 5. GOALS TABLE (Dreams/Targets)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  target_amount NUMERIC(12, 2) NOT NULL,
  icon TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_goals_space_id ON public.goals(space_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);

-- Enable RLS on goals
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Goals RLS Policies
CREATE POLICY "Users can view goals in their spaces"
  ON public.goals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.space_members
      WHERE space_members.space_id = goals.space_id
      AND space_members.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE spaces.id = goals.space_id
      AND spaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Space members can create goals"
  ON public.goals FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.space_members
      WHERE space_members.space_id = goals.space_id
      AND space_members.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE spaces.id = goals.space_id
      AND spaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Space members can update goals"
  ON public.goals FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.space_members
      WHERE space_members.space_id = goals.space_id
      AND space_members.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE spaces.id = goals.space_id
      AND spaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Space admins can delete goals"
  ON public.goals FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE spaces.id = goals.space_id
      AND spaces.owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.space_members
      WHERE space_members.space_id = goals.space_id
      AND space_members.user_id = auth.uid()
      AND space_members.role = 'admin'
    )
  );

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spaces_updated_at BEFORE UPDATE ON public.spaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION: Complete onboarding automation
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_space_id UUID;
BEGIN
  -- Step 1: Create profile
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Step 2: Create personal space
  INSERT INTO public.spaces (name, type, owner_id)
  VALUES ('Carteira Pessoal', 'PERSONAL', NEW.id)
  RETURNING id INTO new_space_id;

  -- Step 3: Add user as admin member of their personal space
  INSERT INTO public.space_members (space_id, user_id, role)
  VALUES (new_space_id, NEW.id, 'admin');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile, space, and membership
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

