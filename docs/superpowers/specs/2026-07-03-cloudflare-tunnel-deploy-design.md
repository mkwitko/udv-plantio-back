# Deploy udv-plantio-back — Cloudflare Tunnel + GitHub Actions

Date: 2026-07-03

## Problem

Deploy the Fastify server (`udv-plantio-back`) with automatic CI/CD, exposed
through Cloudflare, on the same VPS that already runs another app on port 3000.

Cloudflare Workers/Pages cannot host this server: it uses Puppeteer, ffmpeg,
persistent WebSocket, and Prisma — a long-running Node process. So Cloudflare's
role is DNS + routing only; the process runs on the VPS.

## Architecture

```
Internet → Cloudflare (DNS, TLS)
         → Cloudflare Tunnel (cloudflared daemon on VPS)
             → localhost:3333   (udv-plantio-back, PM2)

  (existing app stays on localhost:3000, untouched)
```

- **Cloudflare Tunnel** (not nginx, not open port): `cloudflared` runs on the
  VPS and dials out to Cloudflare. No inbound firewall port, no public IP
  exposure. A public hostname `plantio-api.lexlaboral.com` maps to
  `http://localhost:3333`.
- **Port 3333** for this server (VPS `.env` + repo `.env-example`), avoiding the
  port-3000 collision with the existing app.
- **PM2** manages the process via a named `ecosystem.config.js` (stable name,
  not numeric id).
- **GitHub Actions** (`deploy.yml`, adjusted) builds on push to `main`, SCPs to
  the VPS, regenerates the Prisma client, and reloads PM2.

## CI/CD flow (deploy.yml)

1. Checkout, setup Node 22 with yarn cache.
2. `yarn` install, `yarn build` (tsup → `dist/server.js`).
3. SCP working dir → `/root/projects/udv-plantio-back`.
4. On VPS: `npx prisma generate`, `pm2 startOrReload ecosystem.config.js`,
   `pm2 save`.

DB schema changes use `prisma db push` run **manually** on the VPS (no
migrations dir exists; auto-push in prod risks data loss).

## Manual/infra steps (outside repo)

- Set `PORT=3333` in the VPS `.env`.
- Install `cloudflared`, authenticate, create tunnel, add the public-hostname
  route, run as a service.
- One-time: remove the old numeric PM2 entry after the first named-process
  deploy.

## Out of scope

- nginx reverse proxy (Tunnel replaces it).
- Prisma migration workflow (kept as manual `db push`).
- CORS origin change (still points at the Vercel front-end).
