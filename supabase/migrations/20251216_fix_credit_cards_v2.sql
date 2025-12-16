-- 1. Garante que a tabela de cartões exista (com space_id para compatibilidade)
create table if not exists public.credit_cards (
  id uuid default gen_random_uuid() primary key,
  space_id uuid references public.spaces not null, -- Compatibilidade com SaaS
  user_id uuid references auth.users not null, -- Compatibilidade com User original
  alias text, -- Opcional, pois 'name' já existe ou pode ser alias
  name text, -- Adicionando 'name' caso não exista, comum em outros schemas
  limit_amount numeric default 0,
  closing_day integer,
  due_day integer,
  color text, 
  created_at timestamp with time zone default now()
);

-- 2. Tabela de Transações do Cartão (A que está faltando)
create table if not exists public.card_transactions (
  id uuid default gen_random_uuid() primary key,
  space_id uuid references public.spaces, -- Adicionado para compatibilidade com o sistema de Spaces
  card_id uuid references public.credit_cards on delete cascade not null,
  user_id uuid references auth.users not null,
  description text not null,
  amount numeric not null,
  category text,
  status text default 'pending', -- Adicionado para controle de status (pending/paid)
  transaction_date date default current_date,
  installments_current integer default 1, -- Parcela atual
  installments_total integer default 1,   -- Total de parcelas
  created_at timestamp with time zone default now()
);

-- 3. Habilitar RLS (Segurança)
alter table public.credit_cards enable row level security;
alter table public.card_transactions enable row level security;

-- 4. Políticas de Acesso
-- Remove politicas antigas se existirem para evitar duplicidade
drop policy if exists "Users can manage own cards" on public.credit_cards;
drop policy if exists "Users can manage own card transactions" on public.card_transactions;
drop policy if exists "Users can manage space card transactions" on public.card_transactions;

create policy "Users can manage own cards" on public.credit_cards
  using (auth.uid() = user_id);

create policy "Users can manage own card transactions" on public.card_transactions
  using (auth.uid() = user_id);

-- Politica adicional para Spaces (caso o user_id não seja suficiente se for compartilhado)
create policy "Users can manage space card transactions" on public.card_transactions
    using (exists (select 1 from public.space_members where space_id = card_transactions.space_id and user_id = auth.uid()));
