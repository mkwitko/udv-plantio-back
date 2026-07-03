# Deploy — udv-plantio-back

CI/CD: push to `main` → GitHub Actions builds → SCP to VPS → PM2 reload.
Public access: Cloudflare Tunnel → `localhost:3333` on the VPS.
The existing app stays on port 3000, untouched.

## 1. GitHub Actions secrets (repo → Settings → Secrets → Actions)

| Secret            | Value                                  |
|-------------------|----------------------------------------|
| `SERVER_IP`       | VPS IP                                 |
| `SERVER_USER`     | SSH user (e.g. `root`)                 |
| `SSH_PRIVATE_KEY` | Private key whose public key is in the VPS `~/.ssh/authorized_keys` |

## 2. VPS one-time setup

```bash
# Node via nvm (workflow expects nvm) + PM2
nvm install 22 && nvm use 22
npm i -g pm2

# App dir + env
mkdir -p /root/projects/udv-plantio-back
cd /root/projects/udv-plantio-back
# create .env here (see .env-example). IMPORTANT: PORT=3333
```

`.env` lives only on the VPS (gitignored, not shipped by SCP — it persists
across deploys). Set `PORT=3333` so it does not collide with the port-3000 app.

DB schema: no migrations dir exists, so schema changes are applied manually:

```bash
cd /root/projects/udv-plantio-back && npx prisma db push
```

## 3. First deploy

Push to `main`. The workflow ships the code + `node_modules` + `dist`, runs
`npx prisma generate`, then `pm2 startOrReload ecosystem.config.js`.

If an old numeric PM2 process is still running the previous version, remove it
once (the new one is named `udv-plantio-back`):

```bash
pm2 list                 # find the stale numeric id
pm2 delete <old-id>
pm2 save
```

## 4. Cloudflare Tunnel

```bash
# Install cloudflared on the VPS
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared
chmod +x /usr/local/bin/cloudflared

# Login (opens a browser URL — pick the lexlaboral zone)
cloudflared tunnel login

# Create the tunnel — prints a TUNNEL_ID and a credentials json path
cloudflared tunnel create udv-plantio

# Config: copy the example and fill in TUNNEL_ID
cp /root/projects/udv-plantio-back/deploy/cloudflared-config.example.yml /etc/cloudflared/config.yml
#   edit /etc/cloudflared/config.yml — set tunnel + credentials-file

# DNS route: creates the CNAME plantio-api → tunnel, proxied
cloudflared tunnel route dns udv-plantio plantio-api.lexlaboral.com

# Run as a service (auto-start on boot)
cloudflared service install
systemctl enable --now cloudflared
```

Verify: `https://plantio-api.lexlaboral.com` should reach the Fastify server.
Swagger UI is registered in `src/app.ts` — check its route to confirm.

## Notes

- No inbound firewall port is opened; `cloudflared` dials out to Cloudflare.
- WebSocket (`@fastify/websocket`) works over the tunnel with no extra config.
- CORS origin in `src/app.ts` still targets the Vercel front-end — update if the
  front-end origin changes.
