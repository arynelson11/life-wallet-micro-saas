-- 1. Corrigir tabela de Cartões (Adicionar user_id se faltar)
DO $$ 
BEGIN 
    -- Verifica se a coluna space_id existe (deve existir), se não, adiciona (improvável dado o erro, mas seguro)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'credit_cards' AND column_name = 'space_id') THEN 
        ALTER TABLE public.credit_cards ADD COLUMN space_id UUID REFERENCES public.spaces(id);
    END IF;

    -- Verifica se user_id existe. O erro "column user_id does not exist" vem daqui.
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'credit_cards' AND column_name = 'user_id') THEN 
        ALTER TABLE public.credit_cards ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- 2. Tabela de Transações do Cartão (Garantir criação)
create table if not exists public.card_transactions (
  id uuid default gen_random_uuid() primary key,
  space_id uuid references public.spaces(id), -- Importante para o sistema
  card_id uuid references public.credit_cards(id) on delete cascade not null,
  user_id uuid references auth.users(id),     -- Importante para saber quem comprou
  description text not null,
  amount numeric not null,
  category text,
  status text default 'pending',
  transaction_date date default current_date,
  installments_current integer default 1,
  installments_total integer default 1,
  created_at timestamp with time zone default now()
);

-- 3. Habilitar Segurança (RLS)
alter table public.credit_cards enable row level security;
alter table public.card_transactions enable row level security;

-- 4. Políticas de Acesso (Robustas)
-- Removemos políticas antigas para evitar conflitos
drop policy if exists "Users can manage own cards" on public.credit_cards;
drop policy if exists "Users can view credit_cards in their spaces" on public.credit_cards;
drop policy if exists "Space members can create credit_cards" on public.credit_cards;
drop policy if exists "Space members can update credit_cards" on public.credit_cards;
drop policy if exists "Space members can delete credit_cards" on public.credit_cards;

drop policy if exists "Users can manage own card transactions" on public.card_transactions;
drop policy if exists "Users can manage space card transactions" on public.card_transactions;

-- POlíticas para Cartões: Baseadas no SPACE (Principal) ou USER_ID (Fallback)
create policy "Space members can manage cards" on public.credit_cards
    using (
        exists (select 1 from public.space_members where space_id = credit_cards.space_id and user_id = auth.uid()) OR
        exists (select 1 from public.spaces where id = credit_cards.space_id and owner_id = auth.uid()) OR
        (user_id = auth.uid()) -- Fallback se space_id for nulo ou user for dono direto
    );

-- Políticas para Transações: Baseadas no SPACE (Principal) ou USER_ID (Fallback)
create policy "Space members can manage card transactions" on public.card_transactions
    using (
        exists (select 1 from public.space_members where space_id = card_transactions.space_id and user_id = auth.uid()) OR
        exists (select 1 from public.spaces where id = card_transactions.space_id and owner_id = auth.uid()) OR
        (user_id = auth.uid())
    );
