# The Gift Collective 2026 — Project Brief for Claude

## What This Project Is
A luxury gifting catalogue webapp for The Gift Collective. Content (products, collections, images) is managed entirely through a Google Sheet — no CMS, no database. The sheet is fetched as a CSV and parsed at build/request time via ISR (Incremental Static Regeneration).

---

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS + CSS variables
- **Fonts:** Cormorant Garamond (weights 300, 500, 600, 700) + Jost (300, 400, 500, 600) via `next/font/google`
- **Animations:** Framer Motion
- **Content source:** Google Sheets (CSV export via public URL)
- **Image source:** Google Drive (proxied through `/api/image`)
- **Hosting:** Vercel

---

## URLs
| Environment | URL |
|---|---|
| **Production** | https://the-gift-collective-2026.vercel.app |
| **Dev / Preview** | https://gift-collective-dev.vercel.app |
| **GitHub** | https://github.com/tridgesupport/gift-collective |

---

## Git Setup
- **Branches:** `main` (production), `dev` (preview/staging)
- **Remote:** `https://github.com/tridgesupport/gift-collective.git`
- **Git user:** `tridgesupport` / `support@tridge.co.in`
- **GitHub token scope needed:** `repo` + `workflow` (to push `.github/workflows/`)

---

## Project Structure

```
app/
  page.tsx                          ← Landing page (NO nav — outside (public) group)
  layout.tsx                        ← Root layout: fonts, Toaster
  globals.css                       ← CSS variables + Tailwind
  (public)/
    layout.tsx                      ← Nav + footer + PublishButton (dev only)
    [menuSlug]/
      page.tsx                      ← Redirects to first collection under menu section
      [collectionSlug]/
        page.tsx                    ← Collection page (editorial banner + product grid)
        [productSlug]/
          page.tsx                  ← Product detail page
  api/
    image/route.ts                  ← Google Drive image proxy (any public URL)
    publish/route.ts                ← Secret-protected cache revalidation endpoint (prod)

actions/
  submitInquiry.ts                  ← Inquiry form submission to Google Apps Script
  publishToProduction.ts            ← Server action: calls prod /api/publish securely

components/
  Nav.tsx / NavMobile.tsx           ← Navigation
  EditorialBanner.tsx               ← Full-bleed hero image/video
  ProductGallery.tsx                ← Image/video carousel (aspect-[3/4])
  ProductFrame.tsx                  ← Product card
  PaginatedFrames.tsx               ← Paginated 2-column product grid
  InquiryButton.tsx / InquiryModal.tsx ← Inquiry flow
  PublishButton.tsx                 ← Floating "Publish to Production" button (dev only)

lib/
  sheet.ts                          ← Fetches + parses Google Sheet CSV, formats image URLs
  types.ts                          ← TypeScript types (Asset, Product, Collection, MenuSection, SiteData)
  slugify.ts                        ← URL slug generation

.github/workflows/
  deploy-dev.yml                    ← GitHub Action: deploy dev branch + update alias

vercel.json                         ← Disables Vercel auto-deploy for dev branch (GH Action handles it)
public/
  gift.png                          ← Landing page hero image (dark gift box with gold ribbon)
```

---

## Environment Variables

### Production (`main` branch)
| Variable | Notes |
|---|---|
| `GOOGLE_SHEET_CSV_URL` | Google Sheet published as CSV |
| `GOOGLE_APPS_SCRIPT_URL` | Apps Script endpoint for inquiry submissions |
| `SHEET_REVALIDATE_SECONDS` | `300` (5 min) |
| `PUBLISH_SECRET` | Random hex — must match dev value. **Add via `--value` flag, NOT `echo \|` pipe (echo adds trailing newline which breaks secret matching)** |

### Dev/Preview (`dev` branch)
All of the above PLUS:
| Variable | Notes |
|---|---|
| `SHEET_REVALIDATE_SECONDS` | `30` (30 sec — picks up sheet changes fast) |
| `PROD_URL` | `https://the-gift-collective-2026.vercel.app` |
| `NEXT_PUBLIC_IS_PREVIEW` | `true` — shows the PublishButton on dev site |
| `PUBLISH_SECRET` | Same value as production |

### GitHub Actions Secret
| Secret | Notes |
|---|---|
| `VERCEL_TOKEN` | Full account scope, no expiration — stored in GitHub repo secrets |

---

## Vercel Project IDs
```
projectId:  prj_CBnZN2XFtoCfrHIzU8jNHsJ9sh33
orgId:      team_6zZLnlOJSxZtjQHCk6xjtVmx
team:       support-9048s-projects
```

---

## Key Architectural Decisions

### 1. Google Drive Image Proxy (`/api/image`)
- All Google Drive URLs are converted to `/api/image?url=ENCODED_URL`
- Proxy fetches from `drive.usercontent.google.com/download?id=ID&export=download&authuser=0` (`export=download` gives full quality; `export=view` causes Google to compress/downsize)
- Works for ANY public URL, not just Google Drive
- Returns `Cache-Control: public, max-age=86400, s-maxage=86400` — Vercel CDN caches at edge
- Passes `Range` headers for video seeking

### 2. Next.js `<Image unoptimized>` (not raw `<img>`)
- Using `<Image fill unoptimized>` instead of raw `<img>` tags
- `unoptimized` is required because Next.js image optimizer can't self-fetch `/api/image?url=...` on Vercel (runtime failure — build passes but images show blank)
- `priority` prop is threaded through: `PaginatedFrames → ProductFrame → ProductGallery`
- Editorial banner always has `priority`
- First product on page 0 has `priority`

### 3. Landing Page Outside `(public)` Group
- `app/page.tsx` (root level) — no nav, no footer, just the gift box + CTA
- `app/(public)/` — all other pages have nav + footer
- "Enter the Collective" button → `/curated-collections/` → auto-redirects to first collection

### 4. Dev/Prod Publish Workflow
- Sheet changes appear on dev within 30 seconds (automatic)
- "Publish to Production" button on dev site calls `publishToProduction` server action
- Server action calls `https://the-gift-collective-2026.vercel.app/api/publish` with secret (server-side only — secret never reaches browser)
- `/api/publish` calls `revalidatePath('/', 'layout')` — forces all ISR pages to refetch sheet
- Button only visible when `NEXT_PUBLIC_IS_PREVIEW === 'true'`

### 5. `vercel.json` disables Vercel auto-deploy for `dev`
- Prevents double deployments (Vercel integration + GitHub Action both deploying)
- GitHub Action handles deploy + alias update for dev
- `main` branch still auto-deploys via Vercel's GitHub integration

---

## Dev/Prod Workflow Summary
```
Content editors update Google Sheet
        ↓ (30 seconds)
Dev site auto-updates: https://gift-collective-dev.vercel.app
        ↓ (review)
Click "Publish to Production" button (bottom-right of dev site)
        ↓ (instant)
Production updates: https://the-gift-collective-2026.vercel.app

Code changes:
  Push to dev branch → GitHub Action deploys + updates gift-collective-dev.vercel.app alias
  Merge dev → main → Vercel auto-deploys to production
```

---

## Errors Encountered & Fixes

| Error | Cause | Fix |
|---|---|---|
| Images low quality | `export=view` — Google re-compresses | Changed to `export=download` |
| Images not showing after `<Image>` switch | `/_next/image` can't self-fetch `/api/image?url=...` on Vercel at runtime | Added `unoptimized` prop |
| `PUBLISH_SECRET` mismatch → "Unauthorized" | `echo \|` pipe adds trailing `\n` to env var value | Use `vercel env add VAR env --value "..." --yes` |
| `vercel alias --yes` → unknown option | `--yes` not valid for `alias` command | Removed `--yes` |
| GitHub push rejected for workflow file | Token missing `workflow` scope | Regenerated token with `repo` + `workflow` scopes |
| Dev preview missing `GOOGLE_SHEET_CSV_URL` | Only added for production initially | Added separately for preview/dev environment |
| `revalidateTag` type error (Next.js 16) | API changed in Next.js 16 | Switched to `revalidatePath('/', 'layout')` |

---

## Recommended Image & Video Specs

| Use | Spec |
|---|---|
| Product images | 1200 × 1600 px JPG, 3:4 portrait, under 2 MB |
| Editorial/banner images | 2560 × 1440 px JPG, 16:9 landscape, under 4 MB |
| Product videos | 1080 × 1440 px MP4 H.264, 4–8 Mbps |
| Editorial videos | 1920 × 1080 px MP4 H.264, 8–15 Mbps |

---

## Google Sheet Column Reference
| Column | Notes |
|---|---|
| `menu_section` | Top-level nav item |
| `collection_name` | Sub-section / collection |
| `product_name` | Product name |
| `product_description` | Short descriptor |
| `price` | Numeric |
| `price_visible` | `true` / `false` |
| `min_order_qty` | Default 20 |
| `asset_1_url` … `asset_4_url` | Google Drive share URLs or any public image URL |
| `asset_1_type` … `asset_4_type` | `image` or `video` |
| `collection_editorial_url` | Hero image/video for collection page |
| `collection_editorial_type` | `image` or `video` |
| `collection_description` | Shown in hero overlay |
| `is_homepage` | `true` on one row — marks homepage collection |

---

## User / Project Preferences
- No terminal needed for day-to-day content publishing — everything via the Publish button
- Commits always go to `dev` first, reviewed, then merged to `main`
- No auto-commits — always confirm before committing
- Git email: `support@tridge.co.in`, username: `tridgesupport`
- Vercel team: `support-9048s-projects`
