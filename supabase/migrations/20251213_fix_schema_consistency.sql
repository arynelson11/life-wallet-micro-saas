-- Migration: Fix Schema Consistency (Debts, Cards, Appointments, Transactions)

-- 0. Fix Transactions Table (Missing profile_id)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'profile_id') THEN 
        ALTER TABLE public.transactions ADD COLUMN profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE; 
        CREATE INDEX IF NOT EXISTS idx_transactions_profile_id ON public.transactions(profile_id);
    END IF; 
END $$;

-- 1. Create APPOINTMENTS table (for Calendar/Fixed Bills)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  category TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bill', 'income')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Users can view appointments in their spaces') THEN
        CREATE POLICY "Users can view appointments in their spaces" ON public.appointments FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.space_members WHERE space_members.space_id = appointments.space_id AND space_members.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = appointments.space_id AND spaces.owner_id = auth.uid())
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Space members can create appointments') THEN
        CREATE POLICY "Space members can create appointments" ON public.appointments FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM public.space_members WHERE space_members.space_id = appointments.space_id AND space_members.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = appointments.space_id AND spaces.owner_id = auth.uid())
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Space members can update appointments') THEN
        CREATE POLICY "Space members can update appointments" ON public.appointments FOR UPDATE USING (
            EXISTS (SELECT 1 FROM public.space_members WHERE space_members.space_id = appointments.space_id AND space_members.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = appointments.space_id AND spaces.owner_id = auth.uid())
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Space members can delete appointments') THEN
        CREATE POLICY "Space members can delete appointments" ON public.appointments FOR DELETE USING (
            EXISTS (SELECT 1 FROM public.space_members WHERE space_members.space_id = appointments.space_id AND space_members.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = appointments.space_id AND spaces.owner_id = auth.uid())
        );
    END IF;
END $$;


-- 2. Create DEBTS table (if not exists)
CREATE TABLE IF NOT EXISTS public.debts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL,
  paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  category TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for debts
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'debts' AND policyname = 'Users can view debts in their spaces') THEN
        CREATE POLICY "Users can view debts in their spaces" ON public.debts FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.space_members WHERE space_members.space_id = debts.space_id AND space_members.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = debts.space_id AND spaces.owner_id = auth.uid())
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'debts' AND policyname = 'Space members can create debts') THEN
        CREATE POLICY "Space members can create debts" ON public.debts FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM public.space_members WHERE space_members.space_id = debts.space_id AND space_members.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = debts.space_id AND spaces.owner_id = auth.uid())
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'debts' AND policyname = 'Space members can update debts') THEN
        CREATE POLICY "Space members can update debts" ON public.debts FOR UPDATE USING (
             EXISTS (SELECT 1 FROM public.space_members WHERE space_members.space_id = debts.space_id AND space_members.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = debts.space_id AND spaces.owner_id = auth.uid())
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'debts' AND policyname = 'Space members can delete debts') THEN
        CREATE POLICY "Space members can delete debts" ON public.debts FOR DELETE USING (
             EXISTS (SELECT 1 FROM public.space_members WHERE space_members.space_id = debts.space_id AND space_members.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = debts.space_id AND spaces.owner_id = auth.uid())
        );
    END IF;
END $$;


-- 3. Create CREDIT_CARDS table (if not exists)
CREATE TABLE IF NOT EXISTS public.credit_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  limit_amount NUMERIC(12, 2) NOT NULL,
  closing_day INTEGER NOT NULL CHECK (closing_day BETWEEN 1 AND 31),
  due_day INTEGER NOT NULL CHECK (due_day BETWEEN 1 AND 31),
  color TEXT NOT NULL DEFAULT '#000000',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credit_cards' AND policyname = 'Users can view credit_cards in their spaces') THEN
        CREATE POLICY "Users can view credit_cards in their spaces" ON public.credit_cards FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.space_members WHERE space_members.space_id = credit_cards.space_id AND space_members.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = credit_cards.space_id AND spaces.owner_id = auth.uid())
        );
    END IF;

     IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credit_cards' AND policyname = 'Space members can create credit_cards') THEN
        CREATE POLICY "Space members can create credit_cards" ON public.credit_cards FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM public.space_members WHERE space_members.space_id = credit_cards.space_id AND space_members.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = credit_cards.space_id AND spaces.owner_id = auth.uid())
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credit_cards' AND policyname = 'Space members can update credit_cards') THEN
        CREATE POLICY "Space members can update credit_cards" ON public.credit_cards FOR UPDATE USING (
            EXISTS (SELECT 1 FROM public.space_members WHERE space_members.space_id = credit_cards.space_id AND space_members.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = credit_cards.space_id AND spaces.owner_id = auth.uid())
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credit_cards' AND policyname = 'Space members can delete credit_cards') THEN
        CREATE POLICY "Space members can delete credit_cards" ON public.credit_cards FOR DELETE USING (
            EXISTS (SELECT 1 FROM public.space_members WHERE space_members.space_id = credit_cards.space_id AND space_members.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = credit_cards.space_id AND spaces.owner_id = auth.uid())
        );
    END IF;
END $$;

-- 4. Triggers (Idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_debts_updated_at ON public.debts;
CREATE TRIGGER update_debts_updated_at BEFORE UPDATE ON public.debts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_credit_cards_updated_at ON public.credit_cards;
CREATE TRIGGER update_credit_cards_updated_at BEFORE UPDATE ON public.credit_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
