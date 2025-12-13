-- Create DEBTS table
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

-- RLS Policies for debts
CREATE POLICY "Users can view debts in their spaces"
  ON public.debts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.space_members
      WHERE space_members.space_id = debts.space_id
      AND space_members.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE spaces.id = debts.space_id
      AND spaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Space members can create debts"
  ON public.debts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.space_members
      WHERE space_members.space_id = debts.space_id
      AND space_members.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE spaces.id = debts.space_id
      AND spaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Space members can update debts"
  ON public.debts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.space_members
      WHERE space_members.space_id = debts.space_id
      AND space_members.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE spaces.id = debts.space_id
      AND spaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Space members can delete debts"
  ON public.debts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.space_members
      WHERE space_members.space_id = debts.space_id
      AND space_members.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE spaces.id = debts.space_id
      AND spaces.owner_id = auth.uid()
    )
  );

-- Create CREDIT_CARDS table
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

-- Enable RLS for credit_cards
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for credit_cards
CREATE POLICY "Users can view credit_cards in their spaces"
  ON public.credit_cards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.space_members
      WHERE space_members.space_id = credit_cards.space_id
      AND space_members.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE spaces.id = credit_cards.space_id
      AND spaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Space members can create credit_cards"
  ON public.credit_cards FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.space_members
      WHERE space_members.space_id = credit_cards.space_id
      AND space_members.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE spaces.id = credit_cards.space_id
      AND spaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Space members can update credit_cards"
  ON public.credit_cards FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.space_members
      WHERE space_members.space_id = credit_cards.space_id
      AND space_members.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE spaces.id = credit_cards.space_id
      AND spaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Space members can delete credit_cards"
  ON public.credit_cards FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.space_members
      WHERE space_members.space_id = credit_cards.space_id
      AND space_members.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE spaces.id = credit_cards.space_id
      AND spaces.owner_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_debts_updated_at BEFORE UPDATE ON public.debts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_cards_updated_at BEFORE UPDATE ON public.credit_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
