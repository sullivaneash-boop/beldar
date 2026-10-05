# Beldar Build HQ

A private project headquarters for designing, sourcing, fabricating, testing and wearing a homemade **Beldar Conehead** costume (*Coneheads*, 1993) for Halloween 2026.

It's a working tool for the family building the costume, not a marketing site. It's part fabrication manual, part project tracker, part shopping list, and part field guide for the party itself. Everything in it comes from [`BELDAR_RESEARCH.md`](./BELDAR_RESEARCH.md).

> “Everything for this costume is in here. Just open this.”

## Screenshots

_Add screenshots here after deploying: Mission Control, Guided Build in glue mode, Cone Lab, Party Survival on a phone._

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4 with CSS-variable design tokens |
| UI primitives | shadcn/ui (`base-nova`, Base UI primitives): Dialog, Button |
| Motion | Motion for React (`motion/react`), respects reduced-motion |
| Icons | Lucide |
| Fonts | Big Shoulders (display), Public Sans (body), IBM Plex Mono (specs) via `next/font` |
| Hosting | Vercel (fully static: every route is prerendered) |

There's no database, no auth and no analytics.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build && npm start
```

## Content architecture

The research is converted into typed data modules. The app doesn't render the Markdown file directly.

```
BELDAR_RESEARCH.md        ← source of truth (kept in the repo)
content/
  sources.ts              59 citations, categorized + reliability-rated (ids match [n] in the research)
  phases.ts               11 phases + 5 decision gates
  tasks.ts                34 tasks (checklist IDs 001–016 preserved), prerequisites, gates, instructions
  materials.ts            tiers, materials (research prices only), compatibility matrix, search links
  wardrobe.ts             outfits, pieces, search phrases, character details
  makeup.ts               13 makeup stations, paint-map zones, Halloween application timeline
  troubleshooting.ts      symptom → cause / immediate fix / permanent fix / rebuild?
  survival.ts             party-survival cards, repair kit, safety sections
  cone.ts                 measurement defs, reference facts, rehearsal checks
  warnings.ts             reusable warnings + dashboard alerts
  meta.ts                 method comparison, schedule, confidence labels
types/content.ts          content schema
```

**Evidence labels** keep the research's own wording: Confirmed, Strongly Supported, Likely, Estimated, DIY Recommendation, Requires Prototyping. A **Research Gap** label marks places where the research is silent, so the app flags the gap instead of guessing.

**Inconsistencies in the research are surfaced rather than smoothed over.** Examples:
- The two different gate lists (prose vs JSON appendix) are merged into 5 gates, and each one notes its origin.
- Latex coats are given as 3–4 in one place and 3 in another.
- Super Solv is listed as "Recommended" in the table but "Deluxe" in the appendix.

To update research: edit `BELDAR_RESEARCH.md`, then the matching module in `content/`. User progress is keyed by stable ids (`t-cement`, `g-patch`, `glatzan`), so content edits don't wipe anyone's progress.

## Data model & storage

User state (`types/state.ts`) is kept separate from canonical content:

- **localStorage** key `beldar-hq:project` holds tasks, gates, material/wardrobe status and prices, measurements, assignments, Halloween ticks, rehearsal answers, build log and makeup tests. It carries `schemaVersion: 1`.
- **IndexedDB** (`beldar-hq` → `photos`) stores photos, downscaled to 1400px JPEG. Photos stay on the device.
- `lib/state/store.ts` is a tiny `useSyncExternalStore` store behind a `ProjectStorage` adapter interface. Cloud sync could be added later by swapping in a different adapter, without changing any components.
- `lib/state/validate.ts` normalizes anything loaded or imported. It drops unknown keys, fills in defaults, and rejects newer schema versions with a plain-language message.

### Export / import

Go to **Settings → Backup & restore**:
- **Export** downloads `beldar-build-hq-YYYY-MM-DD.json` (photos optional).
- **Import** validates the file, shows a summary of what it contains, and asks for confirmation before replacing local data.

The build log can also be exported separately as Markdown or JSON.

Each phone keeps its own copy of the data. To share progress, export on one device and import on the other.

## PWA / offline

- `app/manifest.ts`, generated PNG icons (`/pwa-icon/192|512|maskable-512`), `app/apple-icon.tsx` and `app/icon.svg`.
- `public/sw.js` is a hand-rolled service worker with no dependencies, registered in production only:
  - pages: network-first with a cache fallback
  - hashed `/_next/static` assets: cache-first
  - everything else: stale-while-revalidate
  - key routes (Survival, Halloween, Guide…) are precached on install
- To install it: open the site in Safari or Chrome on a phone, then use **Share → Add to Home Screen**.

## Adding reference photos

No copyrighted film imagery is committed. Every instructional diagram is an original SVG. See [`public/references/README.md`](./public/references/README.md). Private stills go in `public/references/private/`, which is git-ignored.

## Deployment

The project is linked to Vercel through the GitHub repo. Every push to `main` deploys to production.

```bash
git push origin main
```

No environment variables are required.

## Routes

`/` Mission Control · `/build` + `/build/[phase]` · `/guide` + `/guide/[task]` · `/cone-lab` · `/materials` · `/wardrobe` · `/makeup` · `/halloween` · `/survival` · `/troubleshooting` · `/safety` · `/rehearsal` · `/research` · `/log` · `/print` + `/print/[sheet]` · `/settings`

## Future improvements

- Optional cloud sync adapter so the family shares one live project (e.g. a small KV store behind a passphrase).
- Tiled multi-page PDF printing of the 1:1 frustum pattern.
- Screenshot gallery in this README.
- Share a build-log entry as an image.
