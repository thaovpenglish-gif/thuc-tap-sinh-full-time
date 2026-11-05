-- Solo cloud saves (applied 2026-11-04 as migration "solo_cloud_saves").
-- Email + game password (no email is sent), and 8-character save codes valid 30 days.
-- Tables are locked (RLS on, no policies, privileges revoked); the browser only calls the SECURITY DEFINER
-- functions below via /rest/v1/rpc/<name> with the anon key (net/cloud.js). The Supabase advisor flags these
-- functions as "anon can execute SECURITY DEFINER" — that is intended: they are the gateway.
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.cloud_accounts (
  email text primary key check (char_length(email) between 5 and 120),
  pass_hash text not null,           -- bcrypt (pgcrypto crypt + gen_salt('bf', 8))
  data jsonb,                        -- the whole Solo career profile (see site/js/game/save.js)
  fails int not null default 0,      -- wrong passwords in a row; 8 → locked 15 minutes
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.cloud_tokens (   -- one row per signed-in device (max 10 per account)
  token_hash text primary key,                     -- sha256 of the token kept in the browser
  email text not null references public.cloud_accounts(email) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists cloud_tokens_email_idx on public.cloud_tokens(email);
create table if not exists public.save_codes (
  code text primary key,                           -- 8 chars from ABCDEFGHJKMNPQRSTUVWXYZ23456789
  data jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 days'
);
alter table public.cloud_accounts enable row level security;
alter table public.cloud_tokens enable row level security;
alter table public.save_codes enable row level security;
revoke all on public.cloud_accounts, public.cloud_tokens, public.save_codes from anon, authenticated;

-- Functions: _tok_hash(text), cloud_login(email, pass) → {ok, created, token, data, updated_at} | {ok:false, error},
-- cloud_push(token, data), cloud_pull(token), cloud_logout(token), save_code_create(data) → {ok, code},
-- save_code_claim(code) → {ok, data}. Full bodies: run
--   select pg_get_functiondef(p.oid) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--   where n.nspname = 'public' and p.proname in ('_tok_hash','cloud_login','cloud_push','cloud_pull','cloud_logout','save_code_create','save_code_claim');
-- (kept in sync with the migration history of project gssscmuhsikgqbjvrlru: supabase migrations list).
