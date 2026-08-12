# syntax=docker/dockerfile:1

# ============================================================
# Build
# ============================================================
FROM node:22-slim AS builder

ENV NODE_ENV=development \
    PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        python3 \
        make \
        g++ \
        openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile \
    && rm -rf /usr/local/share/.cache \
    && yarn cache clean

COPY schema.prisma ./

RUN npx prisma generate

COPY . .

RUN yarn build


# ============================================================
# Production
# ============================================================
FROM node:22-slim AS runner

ENV NODE_ENV=production \
    PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        openssl \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd --gid 1001 appgroup \
    && useradd \
        --uid 1001 \
        --gid appgroup \
        --shell /bin/bash \
        --create-home appuser

COPY --chown=appuser:appgroup package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=true \
    && rm -rf /usr/local/share/.cache \
    && yarn cache clean

COPY --chown=appuser:appgroup schema.prisma ./

RUN npx prisma generate

COPY --chown=appuser:appgroup --from=builder /app/dist ./dist

COPY --chown=appuser:appgroup ecosystem.config.js ./

USER appuser

EXPOSE 3333

HEALTHCHECK \
    --interval=30s \
    --timeout=5s \
    --start-period=15s \
    --retries=3 \
    CMD node -e "fetch('http://localhost:3333/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["npx", "pm2-runtime", "start", "ecosystem.config.js"]