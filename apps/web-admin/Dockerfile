FROM node:22-alpine AS base

FROM base AS base-dev
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base-dev AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN pnpm i -g add turbo
COPY . .
RUN turbo prune web-admin --docker

FROM base-dev AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
COPY --from=installer --chown=nextjs:nodejs /app/apps/web-admin/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web-admin/.next/static ./apps/web-admin/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web-admin/public ./apps/web-admin/public
CMD node apps/web-admin/server.js
