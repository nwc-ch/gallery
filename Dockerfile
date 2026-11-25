# syntax=docker/dockerfile:1
FROM node:24.15.0-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY apps/backend apps/backend
COPY apps/frontend apps/frontend
RUN npm run build

FROM node:24.15.0-bookworm-slim AS production-dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --workspace=backend --include-workspace-root --no-audit --no-fund

FROM production-dependencies AS runtime
ENV NODE_ENV=production PORT=3000 FRONTEND_DIST_PATH=/app/frontend
WORKDIR /app/apps/backend
COPY --from=build --chown=node:node /app/apps/backend/dist ./dist
COPY --from=build --chown=node:node /app/apps/backend/scripts ./scripts
COPY --from=build --chown=node:node /app/apps/frontend/dist/frontend/browser /app/frontend
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api', {signal: AbortSignal.timeout(4000)}).then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]
CMD ["node", "dist/main.js"]
