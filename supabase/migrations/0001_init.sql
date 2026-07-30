create table if not exists enquiries (
  id                   uuid primary key default gen_random_uuid(),
  enquiry_id           text unique not null,        -- the MF-... id from the automation, kept as the natural key
  received_at          timestamptz not null default now(),
  source               text not null check (source in ('email_forward', 'linkedin_dm', 'web_form', 'unknown')),
  raw_text             text not null default '',
  contact_name         text,
  company              text,
  enquiry_type         text not null default 'unclear'
                         check (enquiry_type in ('job_order', 'candidate_enquiry', 'admin_request', 'unclear')),
  role_title           text,
  location             text,
  salary_or_budget     text,
  employment_type      text not null default 'unspecified'
                         check (employment_type in ('permanent', 'temporary', 'contract', 'unspecified')),
  headcount            integer,
  urgency              text,
  sector               text not null default 'unknown'
                         check (sector in ('industrial_warehouse', 'finance_accounting', 'office_admin_support', 'other', 'unknown')),
  confidence           numeric(3,2),
  assigned_desk        text,
  assigned_consultant  text,
  routing_inbox        text,
  needs_human_review   boolean not null default false,
  review_reasons       text,                        
  summary              text,


  status               text not null default 'new'
                         check (status in ('new', 'in_progress', 'awaiting_client', 'placed', 'closed_lost')),
  updated_at           timestamptz not null default now()
);


create index if not exists idx_enquiries_status on enquiries (status);
create index if not exists idx_enquiries_assigned_consultant on enquiries (assigned_consultant);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_enquiries_updated_at on enquiries;
create trigger trg_enquiries_updated_at
  before update on enquiries
  for each row
  execute function set_updated_at();


alter table enquiries enable row level security;

create policy "allow all reads" on enquiries
  for select using (true);

create policy "allow all writes" on enquiries
  for update using (true) with check (true);

create policy "allow all inserts" on enquiries
  for insert with check (true);
