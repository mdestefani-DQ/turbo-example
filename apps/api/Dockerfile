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
RUN turbo prune api --docker

FROM base-dev AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
COPY --from=builder /app/out/full/ .
RUN pnpm run build --filter=api

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=installer /app .
CMD node apps/api/dist/index.js
