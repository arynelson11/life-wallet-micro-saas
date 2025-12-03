create table if not exists fixed_bills (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  amount numeric not null,
  category text not null,
  due_day integer not null check (due_day between 1 and 31),
  description text,
  is_active boolean default true,
  space_id uuid references spaces(id) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists monthly_bills (
  id uuid primary key default gen_random_uuid(),
  fixed_bill_id uuid references fixed_bills(id) on delete cascade,
  title text not null,
  amount numeric not null,
  due_date date not null,
  status text check (status in ('pending', 'paid')) default 'pending',
  description text,
  space_id uuid references spaces(id) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table fixed_bills enable row level security;
alter table monthly_bills enable row level security;

-- Policies (Simplified for now, assuming space_id check is handled by app logic or future strict policies)
create policy "Members can view fixed_bills" on fixed_bills for select using (true);
create policy "Members can insert fixed_bills" on fixed_bills for insert with check (true);
create policy "Members can update fixed_bills" on fixed_bills for update using (true);
create policy "Members can delete fixed_bills" on fixed_bills for delete using (true);

create policy "Members can view monthly_bills" on monthly_bills for select using (true);
create policy "Members can insert monthly_bills" on monthly_bills for insert with check (true);
create policy "Members can update monthly_bills" on monthly_bills for update using (true);
create policy "Members can delete monthly_bills" on monthly_bills for delete using (true);
