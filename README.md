# roxymacedo

Roxy’s homepage (link-in-bio / link tree style), built with React + Vite and hosted on Vercel.

## Local dev

```bash
npm install
npm run dev
```

## Customize links

Edit `src/content/profile.tsx`.

To add a profile photo, put an image in `public/` (example: `public/avatar.jpg`) and set `avatarUrl: "/avatar.jpg"`.

## Blog

Edit posts in `src/content/blog.ts`.

## Deploy (Vercel)

- Import this repo in Vercel.
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
