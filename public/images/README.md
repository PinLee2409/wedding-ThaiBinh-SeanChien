# /public/images

Drop your photos here. Filenames must match the paths in
`src/config/wedding.config.ts`. Any image that is missing shows an elegant
placeholder automatically, so the site never looks broken.

Recommended files (replace with your own, keep the same names — or update the
config):

| File                     | Used for                                   | Suggested size      |
| ------------------------ | ------------------------------------------ | ------------------- |
| `hero.jpg`               | Full-screen landing background             | 1600 × 2000 (4:5+)  |
| `bride.jpg`              | Bride portrait (Love Message)              | 800 × 800 (square)  |
| `groom.jpg`              | Groom portrait (Love Message)              | 800 × 800 (square)  |
| `timeline-1..4.jpg`      | Flight timeline photos                     | 1200 × 900 (4:3)    |
| `gallery-1..6.jpg`       | Photo gallery                              | 1000 × 1400 (5:7)   |
| `boarding-poster.jpg`    | Photo on the downloadable boarding pass    | 1080 × 720 (3:2)    |
| `prewedding-poster.jpg`  | Poster frame for the pre-wedding video     | 1600 × 900 (16:9)   |
| `og-cover.jpg`           | Social-share preview (Open Graph)          | 1200 × 630          |

Tip: compress images (e.g. squoosh.app) so the site loads fast on mobile.

## Current setup

Full-resolution masters live in `/photos-original` (git-ignored — they are
too heavy to ship; the 133 MB passcard PNG cannot even be pushed to GitHub).
The site only references the optimized copies, which ARE committed, so every
deploy shows exactly the same photos as local:

- `public/images/web/` — gallery, profile and boarding-pass photos
  (long side ≤ 1600 px, JPEG q82)
- `src/assets/marquee/` — memory-lane thumbnails (320 px tall, JPEG q75);
  the site draws a random 30 of these on every visit

After adding or replacing masters in `/photos-original` (or
`/photos-original/marquee`), regenerate the optimized copies and commit them:

```
npm run photos
```