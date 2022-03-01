-- Create a table for Public Profiles
create table profiles (
  id uuid references auth.users not null primary key,
  username varchar not null unique,
  name text,
  website text,
  avatar_url text,
  resume_url text,
  linkedin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz default now(),
  cohort varchar(3) constraint validate_cohort check ( cohort ~* '^[a-zA-Z][0-9]{2}$' )
 );

alter table profiles enable row level security;

create type year_enum as enum ( 'Freshman', 'Sophomore', 'Junior', 'Senior', 'Alumni', 'Faculty' );
alter table profiles add column year year_enum;

create type onbd_step_enum as enum ( 'REGISTERED', 'SCREEN_1', 'SCREEN_2', 'COMPLETED' );
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


create function signup_copy_to_users_table() returns trigger
	security definer
	language plpgsql
as $$
BEGIN
    INSERT INTO public.profiles (id, username, name)
    VALUES(new.id, new.email, new.raw_user_meta_data ->> 'full_name');
    RETURN NEW;
  END;
$$;
