

create table profiles (
  id uuid primary key references auth.users(id),
  full_name text not null,
  email text not null,
  created_at timestamptz default now()
);

create table chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  subject text default 'General',
  updated_at timestamptz default now(),
  unique(user_id, subject)
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  session_id uuid references chat_sessions(id) on delete cascade,
  role text check (role in ('user','assistant')) not null,
  content text not null,
  subject text default 'General',
  created_at timestamptz default now()
);


alter table profiles enable row level security;
alter table chat_sessions enable row level security;
alter table messages enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "own sessions" on chat_sessions for all using (auth.uid() = user_id);
create policy "own messages" on messages for all using (auth.uid() = user_id);
