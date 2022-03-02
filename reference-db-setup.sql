-- should recreate db if run on supabase query console, for complete ddl shoot devs@v1 a message.

create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username varchar not null unique,
  name text,
  website text,
  avatar_url text,
  resume_url text,
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
