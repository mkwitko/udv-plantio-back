# Deploy — udv-plantio-back

Dockerized backend (like jurispro's `deploy.sh` + `docker compose` flow), but
ingress is a **Cloudflare Tunnel** instead of nginx — the VPS already runs
`jurispro-nginx` on ports 80/443, so plantio does not bind them.

CI/CD: push to `main` → GitHub Actions SSHes into the VPS → `deploy.sh` →
`git pull` → `docker compose build` → recreate container → `prisma db push` →
health check.

- Backend: Fastify in Docker, bound to **127.0.0.1:3333** on the host.
- Ingress: **cloudflared** (host service) → `http://localhost:3333`. TLS at Cloudflare.
- DB: root `schema.prisma`, no migrations dir → `prisma db push`.
- Repo path on VPS: `/opt/udv-plantio-back` (matches the workflow).

## 1. GitHub Actions secrets (repo → Settings → Secrets → Actions)

| Secret            | Value                                  |
|-------------------|----------------------------------------|
| `SERVER_IP`       | VPS IP                                 |
| `SERVER_USER`     | SSH user (e.g. `ubuntu`)               |
| `SSH_PRIVATE_KEY` | Private key whose public key is in the VPS `~/.ssh/authorized_keys` |

## 2. VPS one-time setup

Requires Docker + Docker Compose plugin. No ports opened (tunnel dials out).

```bash
cd /opt
git clone https://github.com/mkwitko/udv-plantio-back.git
cd udv-plantio-back
cp .env-example .env
vi .env            # fill everything. PORT=3333 is required.
```

`.env` lives only on the VPS (gitignored, persists across deploys).

## 3. Cloudflare Tunnel (one-time)

```bash
# Install cloudflared on the VPS
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 \
  -o /usr/local/bin/cloudflared
chmod +x /usr/local/bin/cloudflared

# Login (opens a browser URL — pick the lexlaboral.com.br zone)
cloudflared tunnel login

# Create the tunnel — prints a TUNNEL_ID + credentials json path
cloudflared tunnel create udv-plantio

# Config: copy the example and fill in TUNNEL_ID + credentials path
sudo mkdir -p /etc/cloudflared
sudo cp /opt/udv-plantio-back/deploy/cloudflared-config.example.yml /etc/cloudflared/config.yml
sudo vi /etc/cloudflared/config.yml

# DNS route: CNAME plantio-api → tunnel, proxied
cloudflared tunnel route dns udv-plantio plantio-api.lexlaboral.com.br

# Run as a service (auto-start on boot)
sudo cloudflared service install
sudo systemctl enable --now cloudflared
```

## 4. First deploy

```bash
cd /opt/udv-plantio-back
chmod +x deploy.sh
./deploy.sh
```

After this, every push to `main` runs `deploy.sh` automatically via the Action.

## 5. Verify

```bash
curl http://localhost:3333/health                        # on the VPS
curl https://plantio-api.lexlaboral.com.br/health        # through the tunnel
```
Expect `{"status":"ok"}`. Swagger UI at `/docs`.

## Notes

- puppeteer/ffmpeg are dependencies but not imported in `src`; the Docker build
  sets `PUPPETEER_SKIP_DOWNLOAD=true` to skip the Chromium download and keep the
  image lean. If puppeteer becomes used at runtime, add Chromium + its libs to the
  runner stage of the `Dockerfile`.
- Backend binds `0.0.0.0` inside the container (see `src/server.ts` + `HOST` env);
  the compose `ports` maps it to `127.0.0.1:3333` on the host.
- WebSocket (`@fastify/websocket`) works over the tunnel with no extra config.
- CORS origin in `src/app.ts` targets the Vercel front-end — update if it changes.
- The existing `jurispro-*` containers and their nginx are untouched.
