
-- 1. Create the 'bookmarks' table
create table public.bookmarks (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text,
  url text not null,
  created_at timestamp with time zone not null default now()
);

-- 2. Enable Security (Row Level Security)
-- This is crucial for privacy (Requirement #3)
alter table public.bookmarks enable row level security;

-- 3. Create Security Policies

-- Policy: Users can only see their OWN bookmarks
create policy "Users can view their own bookmarks"
on public.bookmarks for select
using (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
create policy "Users can insert their own bookmarks"
on public.bookmarks for insert
with check (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
create policy "Users can delete their own bookmarks"
on public.bookmarks for delete
using (auth.uid() = user_id);

-- 4. Enable Realtime updates
-- This is crucial for the "updates in real-time" requirement (Requirement #4)
alter publication supabase_realtime add table public.bookmarks;
