# Project Guidelines

## Read-Only Database Tables
The `leaderboard_campaign` and `leaderboard_influencer` tables are **read-only** — populated by an external system. Never write to, update, or delete from these tables via Prisma or application code. The `leaderboard_influencer` model is marked `@@ignore` in the Prisma schema and queried via raw SQL.

## Database Schema
This project uses `prisma db push` (not migrations). There is no `prisma/migrations` directory.

## Frontend Route Parity
When changing frontend UI, check both `src/app/page.tsx` and `src/app/[slug]/page.tsx`. The root page is the dummy/template leaderboard, while the slug page is the live streamer leaderboard. Reflect shared UI changes in both routes when the sections are analogous.
