-- should recreate db if run on supabase query console, for complete ddl shoot devs@v1 a message.

create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username varchar not null unique,
  name text,
  website text,
-- no need for avatar/resume urls after setting up bucket policies
  linkedin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz default now(),
  cohort varchar(3) constraint validate_cohort check ( cohort ~* '^[a-zA-Z][0-9]{2}$' ),
  phone text,
  fields_of_study jsonb,
  roles text[],
  interests text[]
 );

alter table profiles enable row level security;

create type year_enum as enum ( 'Freshman', 'Sophomore', 'Junior', 'Senior', 'Alumni', 'Faculty' );
alter table profiles add column year year_enum;

create type onbd_step_enum as enum ( 'REGISTERED', 'SCREEN_1', 'SCREEN_2', 'COMPLETE' );
alter table profiles add column onboarding_step onbd_step_enum;

create policy "Enable access to all users" on profiles
	as permissive
	for select
	to public
	using (auth.role() = 'authenticated'::text);

create policy "Enable delete for users based on user_id" on profiles
	as permissive
	for delete
	to public
	using (auth.uid() = id);

create policy "Enable update for users based on id" on profiles
	as permissive
	for update
	to public
	using (auth.uid() = id)
	with check (auth.role() = 'authenticated'::text);

create policy "update if auth" on profiles
	as permissive
	for insert
	to public
	with check (auth.uid() = id);

create function handle_new_user() returns trigger
	security definer
	language plpgsql
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- these bucket policies each have a unique hash_suffix appended to them, only here for reference purpose
CREATE POLICY "Can only read if auth i5g8va_0" ON storage.objects FOR SELECT USING (((bucket_id = 'resumes'::text) AND (role() = 'authenticated'::text)));
CREATE POLICY "Owner IUD Access i5g8va_0" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'resumes'::text) AND (uid() = owner)));
CREATE POLICY "Owner IUD Access i5g8va_1" ON storage.objects FOR UPDATE USING (((bucket_id = 'resumes'::text) AND (uid() = owner)));
CREATE POLICY "Owner IUD Access i5g8va_2" ON storage.objects FOR DELETE USING (((bucket_id = 'resumes'::text) AND (uid() = owner)));

CREATE POLICY "Give auth users access to see avatars 1oj01fe_0" ON storage.objects FOR SELECT USING (((bucket_id = 'avatars'::text) AND (role() = 'authenticated'::text)));
CREATE POLICY "Avatars IUD for just the owner 1oj01fe_0" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'avatars'::text) AND (uid() = owner)));
CREATE POLICY "Avatars IUD for just the owner 1oj01fe_2" ON storage.objects FOR UPDATE USING (((bucket_id = 'avatars'::text) AND (uid() = owner)));
CREATE POLICY "Avatars IUD for just the owner 1oj01fe_1" ON storage.objects FOR DELETE USING (((bucket_id = 'avatars'::text) AND (uid() = owner)));

-- to allow deleting users when they have an object fkey attached
alter table storage.objects
drop constraint objects_owner_fkey,
add constraint objects_owner_fkey
   foreign key (owner)
   references auth.users(id)
   on delete set null;
