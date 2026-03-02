---
description: Deploy Local Supabase Schema to Remote Project
---

This workflow automates linking a local Supabase environment to your remote project and pushing any pending `.sql` migration files to the live database.

1. Ensure your `.env.local` has the `SUPABASE_PROJECT_ID` and `SUPABASE_DB_PASSWORD`.
2. Link the project locally (this stores the ref in `supabase/.temp/project-ref`).
// turbo
npx supabase link --project-ref $SUPABASE_PROJECT_ID -p $SUPABASE_DB_PASSWORD

3. Push all pending migrations in `supabase/migrations/` up to the remote database.
// turbo
npx supabase db push -p $SUPABASE_DB_PASSWORD
