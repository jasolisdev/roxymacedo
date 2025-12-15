# roxymacedo

Roxy’s homepage (link-in-bio / link tree style), built with React + Vite and hosted on Vercel.

## Local dev

```bash
npm install
npm run dev
```

## CMS (Sanity)

- Frontend reads from Sanity using `VITE_SANITY_PROJECT_ID` + `VITE_SANITY_DATASET` (see `.env.example`).
- Sanity Studio lives in `sanity/` (see `sanity/.env.example`).
  - Newsletter signup uses `/api/subscribe` and requires a server-side `SANITY_WRITE_TOKEN` (see `.env.example`).

### Run Sanity Studio

```bash
cd sanity
npm install
cp .env.example .env
npm run dev
```

### Content model

- Create one `Home Page` document and fill in profile + links + (optional) featured post.
- Create `Blog Post` documents for blog entries.
  - Newsletter subscribers are stored as `Newsletter Subscriber` documents when people use the Subscribe form.

### Seed the initial Home Page (optional)

If you don’t want to manually create the Home Page document, you can seed it once:

```bash
cd sanity
cp .env.example .env
# add SANITY_WRITE_TOKEN in your environment (Sanity Manage → API → Tokens)
npm run seed
```

## Blog

If Sanity env vars are set, the site loads posts from Sanity. If not, it falls back to `src/content/blog.ts` and `src/content/profile.tsx`.

## Deploy (Vercel)

- Import this repo in Vercel.
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
