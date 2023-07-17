FROM node:18-buster AS builder
COPY . .
RUN npm ci
RUN npm run build

FROM node:18 AS app
WORKDIR /app
COPY --from=builder lib /app/lib
COPY --from=builder node_modules /app/node_modules

CMD ["node", "lib/index.js"]
