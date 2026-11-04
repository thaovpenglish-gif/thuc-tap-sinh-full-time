-- Anonymous intern confessions wall ("Hội TTS ẩn danh")
create table public.confessions (
  id bigint generated always as identity primary key,
  nickname text not null check (char_length(nickname) between 1 and 24),
  body text not null check (char_length(body) between 1 and 280),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.confessions enable row level security;
create policy "confessions_read_visible" on public.confessions for select to anon, authenticated using (hidden = false);
create policy "confessions_insert" on public.confessions for insert to anon, authenticated
  with check (hidden = false and char_length(body) between 1 and 280 and char_length(nickname) between 1 and 24);
create index confessions_created_idx on public.confessions (created_at desc);

create or replace function public.confessions_flood_guard()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.confessions where created_at > now() - interval '1 minute') >= 40 then
    raise exception 'Too many posts, try again later';
  end if;
  return new;
end $$;
create trigger confessions_flood_guard before insert on public.confessions for each row execute function public.confessions_flood_guard();
revoke all on function public.confessions_flood_guard() from public, anon, authenticated;
alter publication supabase_realtime add table public.confessions;

-- Aggregate choice counts
create table public.choice_counts (
  choice_id text not null check (choice_id ~ '^[a-z0-9_]{1,40}$'),
  option_idx smallint not null check (option_idx between 0 and 9),
  n bigint not null default 0,
  primary key (choice_id, option_idx)
);
alter table public.choice_counts enable row level security;
create policy "choice_counts_read" on public.choice_counts for select to anon, authenticated using (true);

create or replace function public.cast_vote(p_choice text, p_option int)
returns table(option_idx smallint, n bigint)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if p_choice !~ '^[a-z0-9_]{1,40}$' or p_option < 0 or p_option > 9 then raise exception 'invalid vote'; end if;
  if not exists (select 1 from public.choice_counts c where c.choice_id = p_choice and c.option_idx = p_option)
     and (select count(*) from public.choice_counts) >= 600 then raise exception 'vote table full'; end if;
  insert into public.choice_counts as c (choice_id, option_idx, n) values (p_choice, p_option, 1)
  on conflict (choice_id, option_idx) do update set n = c.n + 1;
  return query select c.option_idx, c.n from public.choice_counts c where c.choice_id = p_choice order by c.option_idx;
end $$;
revoke all on function public.cast_vote(text, int) from public;
grant execute on function public.cast_vote(text, int) to anon, authenticated;
