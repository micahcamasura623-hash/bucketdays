-- BucketDays gift vouchers. Run once in the Supabase SQL editor.

create table if not exists vouchers (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  value_pence int not null check (value_pence > 0),
  balance_pence int not null check (balance_pence >= 0),
  buyer_name text,
  buyer_email text,
  recipient_name text,
  message text,
  stripe_session_id text unique,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '12 months')
);

create table if not exists voucher_redemptions (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  amount_pence int not null,
  ref text,
  kind text not null default 'redeem',
  created_at timestamptz not null default now()
);

-- Only the server (service role key) may touch these tables.
alter table vouchers enable row level security;
alter table voucher_redemptions enable row level security;

-- Atomic redeem: returns the new balance in pence, or null if the code is
-- unknown, expired, not active, or has less than p_amount left.
create or replace function redeem_voucher(p_code text, p_amount int, p_ref text)
returns int language plpgsql security definer as $$
declare nb int;
begin
  update vouchers
     set balance_pence = balance_pence - p_amount
   where code = p_code and status = 'active'
     and expires_at > now() and balance_pence >= p_amount and p_amount > 0
  returning balance_pence into nb;
  if nb is not null then
    insert into voucher_redemptions (code, amount_pence, ref, kind) values (p_code, p_amount, p_ref, 'redeem');
  end if;
  return nb;
end $$;

-- Put credit back (failed booking, or a refund paid back as voucher credit).
create or replace function restore_voucher(p_code text, p_amount int, p_ref text)
returns int language plpgsql security definer as $$
declare nb int;
begin
  update vouchers
     set balance_pence = least(value_pence, balance_pence + p_amount)
   where code = p_code and p_amount > 0
  returning balance_pence into nb;
  if nb is not null then
    insert into voucher_redemptions (code, amount_pence, ref, kind) values (p_code, p_amount, p_ref, 'restore');
  end if;
  return nb;
end $$;

revoke all on function redeem_voucher(text, int, text) from public, anon, authenticated;
revoke all on function restore_voucher(text, int, text) from public, anon, authenticated;
