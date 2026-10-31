-- LIFT: abonnementer. Træningsdata gemmes IKKE her – kun om brugeren har Premium.
create table if not exists public.subscriptions (
  user_id               uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id    text unique,
  stripe_subscription_id text,
  status                text not null default 'none',   -- trialing | active | past_due | canceled | none
  plan                  text,                            -- month | year
  current_period_end    timestamptz,
  cancel_at_period_end  boolean default false,
  updated_at            timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

-- Brugeren må kun LÆSE sin egen række. Kun serveren (webhook med service role) må skrive.
drop policy if exists "read own subscription" on public.subscriptions;
create policy "read own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);
