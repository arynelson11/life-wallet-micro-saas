-- Create appointments table
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date timestamp with time zone not null,
  type text check (type in ('bill', 'task')) not null,
  amount numeric,
  space_id uuid references spaces(id) not null,
  status text check (status in ('pending', 'paid')) default 'pending',
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table appointments enable row level security;

-- Policies
create policy "Members can view appointments"
  on appointments for select
  using (
    exists (
      select 1 from space_members
      where space_members.space_id = appointments.space_id
      and space_members.user_id = auth.uid()
    )
    or
    exists (
      select 1 from spaces
      where spaces.id = appointments.space_id
      and spaces.owner_id = auth.uid()
    )
  );

create policy "Members can insert appointments"
  on appointments for insert
  with check (
    exists (
      select 1 from space_members
      where space_members.space_id = appointments.space_id
      and space_members.user_id = auth.uid()
    )
    or
    exists (
      select 1 from spaces
      where spaces.id = appointments.space_id
      and spaces.owner_id = auth.uid()
    )
  );

create policy "Members can update appointments"
  on appointments for update
  using (
    exists (
      select 1 from space_members
      where space_members.space_id = appointments.space_id
      and space_members.user_id = auth.uid()
    )
    or
    exists (
      select 1 from spaces
      where spaces.id = appointments.space_id
      and spaces.owner_id = auth.uid()
    )
  );

create policy "Members can delete appointments"
  on appointments for delete
  using (
    exists (
      select 1 from space_members
      where space_members.space_id = appointments.space_id
      and space_members.user_id = auth.uid()
    )
    or
    exists (
      select 1 from spaces
      where spaces.id = appointments.space_id
      and spaces.owner_id = auth.uid()
    )
  );
