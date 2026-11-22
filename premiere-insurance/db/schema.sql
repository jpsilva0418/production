-- Premiere Insurance lead intake. Idempotent: safe to run on every deploy.
-- The database is the system of record; email/CRM delivery is a copy.

create table if not exists leads (
  id               uuid primary key,
  ref              text not null unique,            -- customer-facing reference, e.g. PI-7K3M9Q
  idempotency_key  text not null unique,            -- client- or provider-generated
  dedupe_hash      text not null,
  created_at       timestamptz not null default now(),
  source           text not null check (source in ('web_voice','web_text','form','phone')),
  locale           text not null check (locale in ('en','pt','es')),
  name             text not null,
  phone            text,
  email            text,
  preferred_contact text check (preferred_contact in ('phone','text','whatsapp','email')),
  line             text not null check (line in ('personal','commercial','mixed','unsure')),
  categories       text[] not null default '{}',
  state            text,
  urgency          text,
  callback_time    text,
  summary          text not null default '',
  details          jsonb not null default '{}',      -- address fields from the classic form
  transcript       jsonb,                            -- only when transcript_consent
  transcript_consent boolean not null default false,
  sms_consent      boolean not null default false,
  queue            text not null check (queue in ('personal','commercial','general','quarantine')),
  delivery_status  text not null default 'pending' check (delivery_status in ('pending','delivered','failed','dead','held')),
  follow_up_status text not null default 'new' check (follow_up_status in ('new','contacted','quoted','closed','spam')),
  ip_hash          text,
  user_agent       text,
  constraint leads_contact_present check (phone is not null or email is not null)
);
create index if not exists leads_created_idx on leads (created_at desc);
create index if not exists leads_dedupe_idx on leads (dedupe_hash, created_at desc);

create table if not exists lead_deliveries (
  id              bigserial primary key,
  lead_id         uuid not null references leads(id) on delete cascade,
  channel         text not null check (channel in ('inbox','email','webhook')),
  target          text not null,
  status          text not null default 'pending' check (status in ('pending','delivered','failed','dead')),
  attempts        int  not null default 0,
  last_error      text,
  provider_id     text,
  next_attempt_at timestamptz not null default now(),
  delivered_at    timestamptz,
  unique (lead_id, channel, target)
);
create index if not exists lead_deliveries_due_idx on lead_deliveries (status, next_attempt_at);

-- Append-only audit trail: who did what to a lead, and every delivery attempt.
create table if not exists lead_events (
  id       bigserial primary key,
  lead_id  uuid references leads(id) on delete cascade,
  at       timestamptz not null default now(),
  actor    text not null,
  type     text not null,
  detail   jsonb not null default '{}'
);
create index if not exists lead_events_lead_idx on lead_events (lead_id, at);

create table if not exists rate_limits (
  key          text not null,
  window_start timestamptz not null,
  count        int not null default 1,
  primary key (key, window_start)
);

-- Supabase exposes the public schema over its REST API. Nothing in the browser
-- talks to these tables: only the server, over a direct connection. RLS with no
-- policies denies the anon and authenticated roles outright.
alter table leads           enable row level security;
alter table lead_deliveries enable row level security;
alter table lead_events     enable row level security;
alter table rate_limits     enable row level security;
