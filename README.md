# Marlow & Finch — Enquiry Desk

A small internal portal so consultants can see enquiries coming out of the
Question 1 intake automation, filter to the ones that matter to them, and
move them along, without ever touching n8n or the automation.

**Live app:** [https://mf-portal-one.vercel.app/](url)
**Repo:** _this repo_

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind for styling
- Supabase (Postgres) for storage, using the JS client directly (no ORM)

## Setup

1. Create a Supabase project.
2. Run the SQL in `supabase/migrations/0001_init.sql` then
   `supabase/migrations/0002_seed.sql` in the Supabase SQL editor (or via the
   CLI: `supabase db push`). The seed file includes the three real records
   from the Question 1 workflow output plus two extra mock rows so the
   filters have something to work with.
3. Copy `.env.example` to `.env.local` and fill in your project's URL and
   anon key (Project Settings → API in the Supabase dashboard).
4. `npm install && npm run dev`, or `vercel deploy` to ship it.

## What it does

- Lists all enquiry records, newest first.
- Filters by **status** and **assigned consultant** (and a "needs review
  only" toggle, since that flag from the automation is exactly what a
  consultant should triage first).
- Lets you change an enquiry's status inline (`new` → `in_progress` →
  `awaiting_client` → `placed` / `closed_lost`) via a dropdown per row.
  Updates go through `PATCH /api/enquiries/[id]` to Supabase and reflect
  optimistically in the UI.

## Schema

See `supabase/migrations/0001_init.sql`. The `enquiries` table mirrors the
record shape the Question 1 workflow produces (`enquiry_id`, `source`,
`enquiry_type`, `sector`, `assigned_consultant`, `needs_human_review`,
etc.) and adds two portal-only columns on top: `status` and `updated_at`,
which is what this app is actually for. Row-level security is enabled with
permissive policies for now (see trade-offs below).

Three code comments worth reading, each marking a trade-off:

- `supabase/migrations/0001_init.sql` — why RLS is wide open in v1 instead
  of blocking the app.
- `app/api/enquiries/[id]/route.ts` — why the API route uses the anon key
  rather than a service-role key.
- `components/EnquiriesTable.tsx` — why status updates are optimistic
  rather than waiting on the round trip.

## What I left out, on purpose

**Authentication.** There's no login. Anyone with the URL can see and edit
every enquiry. For a one-week v1 handed to a five-person team, I'd rather
ship something they can actually use today than block on picking an auth
provider and modeling consultant identities. It's the single highest-
priority follow-up, and it's a contained piece of work: add Supabase Auth,
tighten the RLS policies that are already scaffolded in, done.

## What I insisted on keeping

**The status change has to hit the database, not just the screen.** It
would have been faster to fake it with local state and call it a demo, but
the whole point of the brief is a team that stops needing the automation
open. If clicking a status dropdown doesn't durably persist, the portal
is just a prettier read-only export of the sheet, and consultants would
still be pinging each other (or the founder) asking "did that get
updated?" That's the one thing that had to be real.
