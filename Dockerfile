FROM node:22-slim AS builder

# Skip Chromium download — puppeteer is a dependency but not used at runtime.
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apt-get update && apt-get install -y --no-install-recommends \
  python3 \
  make \
  g++ \
  openssl && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY schema.prisma ./schema.prisma

RUN npx prisma generate

COPY . .

RUN yarn build

# ---------------------------------------

FROM node:22-slim AS runner

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl && \
  rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=true

COPY schema.prisma ./schema.prisma

RUN npx prisma generate

COPY --from=builder /app/dist ./dist

COPY ecosystem.config.js ./

RUN groupadd --gid 1001 appgroup && \
    useradd --uid 1001 \
    --gid appgroup \
    --shell /bin/bash \
    --create-home appuser && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
CMD node -e "fetch('http://localhost:3333/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["npx", "pm2-runtime", "start", "ecosystem.config.js"]
