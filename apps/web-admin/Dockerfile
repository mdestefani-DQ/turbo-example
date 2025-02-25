FROM node:22-alpine AS base

FROM base AS base-dev
RUN apk update
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base-dev AS builder
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm turbo prune web-admin --docker
RUN pnpm turbo build --filter=web-admin
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/web-admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web-admin/.next/static ./apps/web-admin/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web-admin/public ./apps/web-admin/public
CMD node apps/web-admin/server.js
