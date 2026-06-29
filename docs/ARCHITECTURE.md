# nayab.life Architecture

This repository is a **monorepo** with a **Next.js** public frontend, a **NestJS** content API, and shared JSON content at the repo root. The legacy Express app (`app.js`) remains for Plesk deployments until you migrate production to the new stack.

## Folder structure

```
nayab.life/
├── apps/
│   ├── web/                 # Next.js 14 (App Router) — public site + admin UI
│   │   ├── src/app/         # Routes: /, /about, /blog, /admin, …
│   │   ├── src/components/  # Reusable React components
│   │   ├── src/lib/api.ts   # Fetch helpers for NestJS API
│   │   └── public/          # Synced from repo /public (run npm run sync:public)
│   └── api/                 # NestJS REST API
│       └── src/
│           ├── public/      # Public read endpoints (no auth)
│           ├── admin/       # CMS endpoints (JWT required)
│           ├── auth/        # Login → JWT
│           └── content/     # JSON file read/write service
├── packages/
│   └── shared/              # TypeScript types shared by web + api
├── content/                 # **Content source of truth**
│   ├── pages/               # Static pages (about, services, approach)
│   └── posts/{blog,articles,news}/
├── data/                    # Site settings & asset map
│   ├── site.json            # Name, contact, links
│   ├── assets.json          # Image/video paths + cache version
│   └── admin.json           # Admin credentials fallback
├── public/                  # CSS, JS, images (canonical static assets)
├── uploads/                 # CMS media uploads
├── app.js                   # Legacy Express (production on Plesk today)
└── scripts/
    └── sync-public-to-web.js
```

## How frontend and backend connect

| Layer | URL (dev) | Role |
|-------|-----------|------|
| Next.js | http://localhost:3000 | Renders pages, proxies `/api/*` and `/uploads/*` to Nest |
| NestJS | http://localhost:4000/api | Reads/writes JSON in `content/` and `data/` |

Environment variables:

- **Web** (`apps/web/.env.local`): `NEXT_PUBLIC_API_URL`, `API_URL`
- **API** (`apps/api/.env`): `CONTENT_ROOT=../..`, `JWT_SECRET`, `ADMIN_*`, `CORS_ORIGIN`

Next.js rewrites (see `apps/web/next.config.ts`) forward browser requests to the API. Server Components use `API_URL` directly for SSR fetches.

## Editing website content

### Option A — Edit JSON files (recommended for bulk edits)

1. Edit files under `content/` or `data/`.
2. Restart is not required; API reads files on each request.
3. Refresh the Next.js page (60s revalidate by default).

| File | What it controls |
|------|------------------|
| `data/site.json` | Site name, tagline, email, phone, external links |
| `data/assets.json` | Hero images, banners, video paths; bump `version` to bust cache |
| `content/pages/about.json` | About page body (Markdown) |
| `content/posts/blog/*.json` | Blog posts |

### Option B — Admin UI + API

1. Start dev stack: `npm run dev`
2. Open http://localhost:3000/admin/login
3. Default credentials: `nayab_admin` / `NayabLife2025!` (or values in `apps/api/.env`)
4. Dashboard shows stats; full CRUD is available via API (`/api/admin/*`) for tools or future admin screens.

### Option C — Legacy Express admin

The original stack at `app.js` still serves `/admin` with session auth. Use `npm run legacy:start` if you need the old EJS admin during transition.

## Development commands

```bash
npm install              # Install all workspaces
npm run sync:public      # Copy /public → apps/web/public
npm run dev              # API :4000 + Web :3000
npm run dev:api          # NestJS only
npm run dev:web          # Next.js only
npm run build            # Production build (shared → api → web)
```

## API overview

**Public (no auth)**

- `GET /api/site` — site settings + assets
- `GET /api/pages`, `GET /api/pages/:slug`
- `GET /api/posts/:type`, `GET /api/posts/:type/:slug`

**Auth**

- `POST /api/auth/login` — `{ username, password }` → `{ accessToken }`

**Admin (Bearer JWT)**

- `GET /api/admin/stats`
- `GET|PUT /api/admin/site`
- CRUD on posts and pages under `/api/admin/posts/*`, `/api/admin/pages/*`
- Media upload: `POST /api/admin/media` (multipart `files`)

## Best practices

1. **Single source of truth** — Keep content in root `content/` and `data/`; both Nest API and legacy Express read the same files.
2. **Shared types** — Add interfaces to `packages/shared` when web and API need the same shapes.
3. **Static assets** — Add images to repo `public/`; run `npm run sync:public` before web build/deploy.
4. **Secrets** — Never commit `.env`; use Plesk/host env vars for `JWT_SECRET` and admin passwords in production.
5. **Deploy separately** — Run Next (port 3000) and Nest (port 4000) as two Node processes behind a reverse proxy, or containerize each app.
6. **Incremental migration** — Keep legacy Express live until Next/Nest are tested; switch DNS/proxy when ready.
7. **Cache busting** — Increment `data/assets.json` → `version` after replacing images referenced sitewide.

## Production deployment (outline)

1. Build: `npm run build`
2. Start API: `npm run start:api` with `CONTENT_ROOT` pointing to deployed content directory
3. Start Web: `npm run start:web` with `API_URL` pointing to internal API URL
4. Configure reverse proxy: `/` → Next, `/api` and `/uploads` → Nest (or rely on Next rewrites)

See also `docs/PLESK-DEPLOYMENT.md` for the current Express deployment; adapt for dual-app hosting when migrating.
