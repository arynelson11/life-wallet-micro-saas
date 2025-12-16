-- 1. Create CARD_TRANSACTIONS table
CREATE TABLE IF NOT EXISTS public.card_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.credit_cards(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  category TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  installments INTEGER DEFAULT 1,
  installment_number INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending', -- pending, billed, paid
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.card_transactions ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'card_transactions' AND policyname = 'Users can view card_transactions in their spaces') THEN
        CREATE POLICY "Users can view card_transactions in their spaces" ON public.card_transactions FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.space_members WHERE space_members.space_id = card_transactions.space_id AND space_members.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = card_transactions.space_id AND spaces.owner_id = auth.uid())
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'card_transactions' AND policyname = 'Space members can create card_transactions') THEN
        CREATE POLICY "Space members can create card_transactions" ON public.card_transactions FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM public.space_members WHERE space_members.space_id = card_transactions.space_id AND space_members.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = card_transactions.space_id AND spaces.owner_id = auth.uid())
        );
    END IF;

     IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'card_transactions' AND policyname = 'Space members can update card_transactions') THEN
        CREATE POLICY "Space members can update card_transactions" ON public.card_transactions FOR UPDATE USING (
            EXISTS (SELECT 1 FROM public.space_members WHERE space_members.space_id = card_transactions.space_id AND space_members.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = card_transactions.space_id AND spaces.owner_id = auth.uid())
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'card_transactions' AND policyname = 'Space members can delete card_transactions') THEN
        CREATE POLICY "Space members can delete card_transactions" ON public.card_transactions FOR DELETE USING (
             EXISTS (SELECT 1 FROM public.space_members WHERE space_members.space_id = card_transactions.space_id AND space_members.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = card_transactions.space_id AND spaces.owner_id = auth.uid())
        );
    END IF;
END $$;
