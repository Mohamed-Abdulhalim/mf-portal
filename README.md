# Marlow & Finch Enquiry Desk

A small internal portal so consultants can see enquiries, filter them, and move them along effortlessly.

**Live app:** [https://mf-portal-one.vercel.app/](https://mf-portal-one.vercel.app/)

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind
- Supabase (Postgres)

## Setup

1. Create a Supabase project.
2. Run the SQL in `supabase/migrations/0001_init.sql`, then `supabase/migrations/0002_seed.sql`, in the Supabase SQL editor (or via the CLI: `supabase db push`). The seed file includes three real records from the n8n intake workflow output plus two extra mock rows so the filters have something to work with.
3. Copy `.env.example` to `.env.local` and fill in your project's URL and anon key (Project Settings → API in the Supabase dashboard).
4. `npm install && npm run dev`, or `vercel deploy` to ship it.

## What it does

- Lists all enquiry records newest first.
- Filters by status and assigned consultant plus a "needs review only" toggle.
- Lets you change an enquiry's status via a dropdown per row. Updates go to Supabase and reflect live in the UI.

## Schema

Check [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql). The `enquiries` table mirrors the record shape that the n8n workflow produces and adds two portal only columns on top of them which are `status` and `updated_at`.


## What I left out on purpose

There's no login so anyone with the URL can see and edit every enquiry. For a one week v1 handed to a team of 5, I'd rather ship something that they can use today than picking an auth provider and modeling consultant logins. That's the highest priority and it's a contained piece of work, you can add Supabase Auth and tighten the RLS policies and you're done.

## What I kept on purpose

The status changes update on the interface instantly before the database confirms the change instead of waiting on the round trip like the simpler version would. Cuz a consultant clicking through a list of enquiries would feel every stall so removing that is more important than the extra code it took. And if the write fails, the badge snaps back and shows an error message instead of failing silently.
