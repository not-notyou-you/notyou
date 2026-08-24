# Portfolio Admin

React + Vite + TypeScript admin panel for the Identity / Intellect / Passion
portfolio, backed by Supabase (Postgres + Auth) and Cloudinary (image
hosting). Built from `BACKEND_SETUP_GUIDE.md` and
`ADMIN_PANEL_ARCHITECTURE.md`.

## What's included

- `sql/schema.sql` — every table, index, RLS policy, trigger, and seed data
  pulled from your identity/intellect/passion JSON (run this once).
- Supabase client + Cloudinary unsigned-upload helper (`src/lib`).
- Auth (`src/hooks/useAuth.ts`) wired to Supabase Auth — any user you create
  in Supabase Auth can sign in; there's no separate baked-in admin password.
- Generic CRUD hook (`useSupabaseTable`) used by most sections, plus three
  specialized hooks: `useProjects` (handles the `project_technologies` join
  table), `usePageContent` (per-page greeting/quote singleton), and
  `useProfile` (the single profile row).
- Full component set: `AdminLayout`, `DataTable`, `Modal`, `FormInput`,
  `TagsInput`, `ImageUpload` (upload to Cloudinary or paste a link, including
  Google Drive share links), `MultiImageUpload` (project gallery, up to 3),
  `ImageWithFallback` (section-colored placeholder on missing/broken images),
  `DeleteConfirmation`, `ToggleSwitch`.
- 13 modals — one per entity — all following the same pattern: local form
  state, inline validation on required fields only, optimistic list update
  on save.
- Three management pages (Identity, Intellect, Passion) plus a dashboard
  index and login page.
- `admin.css` implementing your exact spec: no gradients, 2px borders, sharp
  corners (4px only on inputs), per-page accent color, full dark mode.

## One addition beyond the original spec

Your two guide docs list Education/Experience/Languages under Identity, but
the schema also has `profile` and `socials` tables with no admin page to
edit them. I added a compact "Profile & Contact" section at the top of the
Identity page (one edit modal + a small socials table) so nothing in the
schema is orphaned. Delete `ProfileModal`/`SocialModal` and the section in
`IdentityManagementPage.tsx` if you don't want it.

## One deviation from the guide, on purpose

`BACKEND_SETUP_GUIDE.md`'s `.env.local` template includes
`VITE_ADMIN_EMAIL` / `VITE_ADMIN_PASSWORD`. Anything prefixed `VITE_` gets
bundled into the client-side JS and is readable by anyone who opens dev
tools — so baking admin credentials into it would defeat the point of
having auth at all. This build skips those two vars entirely and relies on
Supabase Auth's own user store (see setup step 4 below), which is what the
architecture doc's login flow already assumes.

## Update: images, hierarchy, and responsive fixes

Four things changed since the first version:

**1. Clearer light/dark hierarchy + responsive fixes.** `admin.css` now uses
a proper surface scale (`--bg-page` → `--bg-header` → `--bg-surface` →
`--bg-button`, each a distinct flat tone, no gradients) so cards visibly
lift off the page and hover states are unmistakable. Also fixed two real
responsive bugs: form fields inside two-column rows could force a modal
wider than the viewport on tablets (classic CSS Grid `min-width: auto`
gotcha — grid children now get `min-width: 0`), and the header title could
overflow on narrow screens for the same reason.

**2. Image fields added** to Profile (photo), Education (photo), Experience
(logo), Project (1 cover + up to 3 additional images), Skills (logo — used
for Programming Languages/Frameworks entries), Certifications (photo), and
the Intellect/Passion greeting-quote page content (photo). All optional.
**Run `sql/migration_002_add_images.sql`** in the Supabase SQL Editor to add
these columns to your existing database.

**3. Never-empty images.** Every image on every admin page now renders
through `ImageWithFallback`, which shows a section-colored placeholder the
moment an image is missing or fails to load. Drop your 3 files into
`public/placeholders/` with these exact names (see the README already in
that folder):
- `black_placeholder.webp` — Identity
- `blue_placeholder.webp` — Intellect
- `red_placeholder.webp` — Passion

**4. Two ways to set an image**, everywhere `ImageUpload` appears: "Upload
file" (unchanged — goes to Cloudinary, any image MIME type including SVG)
or "Paste a link" (any direct image URL, or a Google Drive share link like
`.../file/d/FILE_ID/view`, which gets auto-converted to Drive's direct-view
endpoint). The Drive file must be shared as "Anyone with the link" — very
large files can still show Google's virus-scan interstitial instead of the
image, which is a Drive limitation no URL rewrite can get around.

## Setup

### 1. Create the Supabase project & run the schema

1. Create a project at supabase.com.
2. Open the SQL Editor and run all of `sql/schema.sql`. It creates every
   table, enables RLS, and seeds real data from your three JSON files.
3. Already have the database from before? Also run
   `sql/migration_002_add_images.sql` — it adds the new image columns
   without touching your existing rows.
4. Copy your Project URL and **Publishable key** from Settings → API Keys.
   (Newer Supabase projects only show "Publishable key" / "Secret key" —
   these replaced the old "anon key" / "service_role key" naming in 2025.
   The publishable key is the client-safe one; use that here, never the
   secret key.)

### 2. Create a Cloudinary unsigned upload preset

1. Cloudinary dashboard → Settings → Upload → Upload presets → Add preset.
2. Signing mode: **Unsigned**. Folder: `portfolio` (optional, the app also
   passes this at upload time). Save it and copy the preset name.

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`,
`VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`.

### 4. Create your admin login

Supabase dashboard → Authentication → Users → Add user. Enter the email +
password you want to sign in with at `/admin/login`. Any confirmed user in
Supabase Auth can access the panel — there's no separate role check yet
(the `admin_users` table exists in the schema for when you want one).

### 5. Install and run

```bash
npm install
npm run dev
```

Visit `http://localhost:5173/admin/login`.

### 6. Build for production

```bash
npm run build
```

Outputs to `dist/`. Deploy that folder to Cloudflare Pages (or anywhere
static).

## Verified

This project was installed and built in a clean sandbox before delivery:
`npm install`, `tsc -b` (0 errors), and `vite build` all pass. It has not
been run against a live Supabase project — that requires your real
credentials — so do a smoke test of each CRUD flow after you deploy.

## Known gaps / intentionally skipped

Per the brief's own "optional, skip if short on time" list:

- **No drag-to-reorder.** Every list-style table has a plain "Sort order"
  number field instead (maps to the schema's `position`/`position_order`
  columns), so ordering is still fully controllable — just typed, not
  dragged.
- **No pagination.** Fine for the current data volumes (the biggest table,
  creative works, seeds 44 rows); revisit if any table grows past ~200 rows.
- **No bulk delete / CSV export / analytics dashboard.**
- **`admin_users` table isn't enforced yet.** Any Supabase Auth user can
  sign in and edit everything. Add a real role check in
  `ProtectedRoute.tsx` once you have more than one admin.

## Folder structure

```
src/
├── lib/            supabase.ts, cloudinary.ts, auth.ts
├── hooks/          useAuth, useSupabaseTable, useProjects, usePageContent, useProfile, useImageUpload
├── contexts/       ThemeContext (dark mode)
├── types/          TypeScript interfaces mirroring sql/schema.sql
├── styles/         admin.css
├── components/
│   ├── common/     Button, LoadingSpinner, ToggleSwitch
│   └── admin/      AdminLayout, AdminHeader, ProtectedRoute, DataTable,
│                   Modal, FormInput, TagsInput, ImageUpload,
│                   DeleteConfirmation, VisibilityPill, modals/*
└── pages/admin/    LoginPage, ManagementIndexPage, IdentityManagementPage,
                    IntellectManagementPage, PassionManagementPage
sql/schema.sql
```
