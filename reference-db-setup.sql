-- Create a table for Public Profiles
create table profiles (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  resume_url text,
  website text,
  linkedin text,
  cohort vachar(3) constraint validate_cohort check ( cohort ~* '^[a-zA-Z][0-9]{2}$' ),

  primary key (id),
  --- can mutate this in the middleware but as a baseline a good check
  constraint username_length check (char_length(username) >= 3)
);

alter table profiles enable row level security;

create policy "profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can only insert into their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can only update own profile."
  on profiles for update
  using ( auth.uid() = id );

create policy "Users can only delete own profile."
  on profiles for delete
  using ( auth.uid() = id );

-- Set up Realtime!
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table profiles;

-- Set up Storage
insert into storage.buckets (id, name)
values ('avatars', 'avatars');

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

---

insert into storage.buckets (id, name)
values ('resumes', 'resumes');

create policy "Resumes are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'resumes', auth.uid() = id );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars', auth.uid() = id );
