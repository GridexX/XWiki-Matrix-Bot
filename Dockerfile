FROM node:16-alpine
WORKDIR /app
COPY lib /app/lib

CMD ["node", "lib/index.js"]
