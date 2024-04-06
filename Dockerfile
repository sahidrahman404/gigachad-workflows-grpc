FROM node:18-alpine AS base

RUN corepack enable
# dumb-init helps handling SIGTERM and SIGINT correctly
RUN apk add dumb-init

FROM base AS deps
WORKDIR /app

# copy package.json and package-lock.json separately to cache dependencies
COPY package*.json yarn.lock .yarnrc.yml ./
RUN yarn --immutable

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn proto
RUN yarn prebundle
RUN yarn bundle

FROM base as runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder --chown=node:node /app/dist/index.js ./dist/index.js

EXPOSE 9080
USER node
CMD ["dumb-init", "node", "./dist/index.js"]
