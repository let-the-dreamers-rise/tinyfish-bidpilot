-- =============================================
-- BidPilot Database Schema for Supabase
-- Run this in the Supabase SQL Editor
-- =============================================

-- 1. Teams
create table public.teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  plan text default 'starter' check (plan in ('starter', 'pro', 'enterprise')),
  created_at timestamptz default now()
);

alter table public.teams enable row level security;

-- 2. Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  team_id uuid references public.teams on delete set null,
  role text default 'admin' check (role in ('admin', 'operator', 'viewer')),
  onboarded boolean default false,
  portals_used text[] default '{}',
  packets_per_month integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- 3. Vendor Packets
create table public.vendor_packets (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams on delete cascade not null,
  vendor_name text not null,
  portal_url text not null,
  portal_name text,
  owner_name text not null,
  status text default 'draft' check (status in ('draft', 'ready', 'running', 'review', 'approved', 'blocked')),
  progress integer default 0,
  due_date text,
  packet_id text not null default ('PKT-' || upper(substr(gen_random_uuid()::text, 1, 4))),
  summary text,
  field_mappings jsonb default '[]'::jsonb,
  checklist jsonb default '[]'::jsonb,
  created_by uuid references public.profiles on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.vendor_packets enable row level security;

-- 4. Documents
create table public.documents (
  id uuid default gen_random_uuid() primary key,
  packet_id uuid references public.vendor_packets on delete cascade not null,
  file_name text not null,
  file_size integer,
  file_type text,
  storage_path text not null,
  status text default 'uploaded' check (status in ('uploaded', 'attached', 'verified')),
  uploaded_by uuid references public.profiles on delete set null,
  created_at timestamptz default now()
);

alter table public.documents enable row level security;

-- 5. TinyFish Runs
create table public.tinyfish_runs (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams on delete cascade not null,
  packet_id uuid references public.vendor_packets on delete set null,
  tf_run_id text,
  goal text not null,
  url text not null,
  safety_mode text default 'read-only',
  browser_profile text default 'stealth',
  status text default 'pending',
  steps jsonb default '[]'::jsonb,
  result jsonb default '{}'::jsonb,
  error_message text,
  started_by uuid references public.profiles on delete set null,
  created_at timestamptz default now(),
  finished_at timestamptz
);

alter table public.tinyfish_runs enable row level security;

-- 6. Audit Entries
create table public.audit_entries (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams on delete cascade not null,
  packet_id uuid references public.vendor_packets on delete set null,
  run_id uuid references public.tinyfish_runs on delete set null,
  action text not null,
  detail text,
  actor_id uuid references public.profiles on delete set null,
  actor_name text,
  created_at timestamptz default now()
);

alter table public.audit_entries enable row level security;

-- 7. Portal Intelligence
create table public.portal_intelligence (
  id uuid default gen_random_uuid() primary key,
  portal_domain text not null unique,
  portal_name text,
  field_mappings jsonb default '[]'::jsonb,
  quirks jsonb default '[]'::jsonb,
  runs_completed integer default 0,
  last_run_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.portal_intelligence enable row level security;

-- =============================================
-- Row Level Security Policies
-- =============================================

-- Teams: Members can read their own team
create policy "Users can view their own team"
  on public.teams for select
  using (id in (select team_id from public.profiles where id = auth.uid()));

create policy "Users can update their own team"
  on public.teams for update
  using (id in (select team_id from public.profiles where id = auth.uid() and role = 'admin'));

-- Profiles: Users can read/update their own profile and view team members
create policy "Users can view own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users can view team members"
  on public.profiles for select
  using (team_id in (select team_id from public.profiles where id = auth.uid()));

create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (id = auth.uid());

-- Vendor Packets: Team members can CRUD packets
create policy "Team members can view packets"
  on public.vendor_packets for select
  using (team_id in (select team_id from public.profiles where id = auth.uid()));

create policy "Team members can create packets"
  on public.vendor_packets for insert
  with check (team_id in (select team_id from public.profiles where id = auth.uid()));

create policy "Team members can update packets"
  on public.vendor_packets for update
  using (team_id in (select team_id from public.profiles where id = auth.uid()));

create policy "Admins can delete packets"
  on public.vendor_packets for delete
  using (team_id in (select team_id from public.profiles where id = auth.uid() and role = 'admin'));

-- Documents: Team members can manage documents
create policy "Team members can view documents"
  on public.documents for select
  using (packet_id in (select id from public.vendor_packets where team_id in (select team_id from public.profiles where id = auth.uid())));

create policy "Team members can upload documents"
  on public.documents for insert
  with check (packet_id in (select id from public.vendor_packets where team_id in (select team_id from public.profiles where id = auth.uid())));

create policy "Team members can update documents"
  on public.documents for update
  using (packet_id in (select id from public.vendor_packets where team_id in (select team_id from public.profiles where id = auth.uid())));

create policy "Team members can delete documents"
  on public.documents for delete
  using (packet_id in (select id from public.vendor_packets where team_id in (select team_id from public.profiles where id = auth.uid())));

-- TinyFish Runs: Team members can view/create runs
create policy "Team members can view runs"
  on public.tinyfish_runs for select
  using (team_id in (select team_id from public.profiles where id = auth.uid()));

create policy "Team members can create runs"
  on public.tinyfish_runs for insert
  with check (team_id in (select team_id from public.profiles where id = auth.uid()));

create policy "Team members can update runs"
  on public.tinyfish_runs for update
  using (team_id in (select team_id from public.profiles where id = auth.uid()));

-- Audit Entries: Team members can view audit logs
create policy "Team members can view audit entries"
  on public.audit_entries for select
  using (team_id in (select team_id from public.profiles where id = auth.uid()));

create policy "System can insert audit entries"
  on public.audit_entries for insert
  with check (team_id in (select team_id from public.profiles where id = auth.uid()));

-- Portal Intelligence: All authenticated users can read, system writes
create policy "Authenticated users can view portal intelligence"
  on public.portal_intelligence for select
  using (auth.uid() is not null);

create policy "Authenticated users can upsert intelligence"
  on public.portal_intelligence for insert
  with check (auth.uid() is not null);

create policy "Authenticated users can update intelligence"
  on public.portal_intelligence for update
  using (auth.uid() is not null);

-- =============================================
-- Auto-create profile on signup trigger
-- =============================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  new_team_id uuid;
begin
  -- Create a personal team for the new user
  insert into public.teams (name)
  values (coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)) || '''s Team')
  returning id into new_team_id;

  -- Create the profile
  insert into public.profiles (id, email, full_name, avatar_url, team_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url',
    new_team_id
  );

  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- Storage bucket for documents
-- =============================================

insert into storage.buckets (id, name, public)
values ('packet-documents', 'packet-documents', false);

create policy "Team members can upload to packet-documents"
  on storage.objects for insert
  with check (
    bucket_id = 'packet-documents'
    and auth.uid() is not null
  );

create policy "Team members can view packet-documents"
  on storage.objects for select
  using (
    bucket_id = 'packet-documents'
    and auth.uid() is not null
  );

create policy "Team members can delete from packet-documents"
  on storage.objects for delete
  using (
    bucket_id = 'packet-documents'
    and auth.uid() is not null
  );
