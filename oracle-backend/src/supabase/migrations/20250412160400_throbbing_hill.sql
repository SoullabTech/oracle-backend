-- Enable RLS
alter table auth.users enable row level security;

-- Configure Storage
insert into storage.buckets (id, name)
values ('avatars', 'avatars')
on conflict do nothing;

-- Create users table
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  created_at timestamptz default now(),
  last_login timestamptz,
  constraint fk_auth_user
    foreign key (id)
    references auth.users (id)
    on delete cascade
);

-- Enable RLS for users table
alter table public.users enable row level security;

-- Create policy for users table
create policy "Users can read own data"
  on public.users for select
  using (auth.uid() = id);

-- Create memories table
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  constraint fk_user_memories
    foreign key (user_id)
    references auth.users (id)
    on delete cascade
);

-- Enable RLS for memories table
alter table public.memories enable row level security;

-- Create policies for memories table
create policy "Users can read own memories"
  on public.memories for select
  using (auth.uid() = user_id);

create policy "Users can insert own memories"
  on public.memories for insert
  with check (auth.uid() = user_id);

create policy "Users can update own memories"
  on public.memories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own memories"
  on public.memories for delete
  using (auth.uid() = user_id);

-- Create sessions table
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  started_at timestamptz default now(),
  ended_at timestamptz,
  status text default 'active',
  metadata jsonb default '{}'::jsonb,
  constraint fk_user_sessions
    foreign key (user_id)
    references auth.users (id)
    on delete cascade
);

-- Enable RLS for sessions table
alter table public.sessions enable row level security;

-- Create policies for sessions table
create policy "Users can read own sessions"
  on public.sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on public.sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own sessions"
  on public.sessions for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists idx_memories_user_id on public.memories(user_id);
create index if not exists idx_sessions_user_id on public.sessions(user_id);
create index if not exists idx_sessions_status on public.sessions(status);