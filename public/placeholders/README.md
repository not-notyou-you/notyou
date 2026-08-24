# Drop your 3 placeholder images here, with these exact filenames:

- black_placeholder.webp  — used everywhere on the Identity page/admin
- blue_placeholder.webp   — used everywhere on the Intellect page/admin
- red_placeholder.webp    — used everywhere on the Passion page/admin

That's it — no other config needed. Vite serves everything in `public/` as
static files from the site root, so these become `/placeholders/black_placeholder.webp`
etc., which is exactly what `src/lib/imageUrl.ts` expects.

They're shown automatically whenever:
- an image field is empty (nothing uploaded yet), or
- an image URL is broken / fails to load (deleted file, expired Drive link, etc.)

See `ImageWithFallback.tsx` for the component that does this.
