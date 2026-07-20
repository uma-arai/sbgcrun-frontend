# === builder: 依存関係生成用 ===
FROM node:25-slim AS builder
WORKDIR /app
# node:25-slim does not ship corepack, so install the pinned pnpm directly.
RUN npm install -g pnpm@10.33.2
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store
COPY . .
RUN pnpm build

# === prod-deps: 本番用依存関係のみ抽出 ===
FROM node:25-slim AS prod-deps
WORKDIR /app
RUN npm install -g pnpm@10.33.2
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile --store-dir /pnpm/store

# === runner: 最終イメージ===
FROM node:25-slim AS runner
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app
COPY --chown=node:node package.json /app/
COPY --from=prod-deps --chown=node:node /app/node_modules /app/node_modules
COPY --from=builder  --chown=node:node /app/build        /app/build

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8080/healthcheck').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

USER node
CMD ["./node_modules/.bin/react-router-serve", "./build/server/index.js"]
