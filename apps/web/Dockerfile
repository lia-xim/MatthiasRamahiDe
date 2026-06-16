FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache git openssh-client rsync
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate
ENV ASTRO_TELEMETRY_DISABLED=1

FROM base AS deps
COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
ARG ASTRO_CONTENT_SOURCE=tina
ENV ASTRO_CONTENT_SOURCE=${ASTRO_CONTENT_SOURCE}
RUN pnpm --filter @matthias-ramahi/web build

FROM build AS cms

FROM build AS site-package
RUN pnpm --filter @matthias-ramahi/web deploy --prod --legacy /app/site

FROM base AS runner
ENV NODE_ENV=production
ARG ASTRO_CONTENT_SOURCE=tina
ENV ASTRO_CONTENT_SOURCE=${ASTRO_CONTENT_SOURCE}
COPY --from=site-package /app/site /app
EXPOSE 4321
CMD ["node", "dist/server/entry.mjs"]
