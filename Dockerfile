FROM oven/bun:1.2.0

WORKDIR /app

COPY package.json .
COPY bun.lock .

RUN bun install --frozen-lockfile

COPY . .

ENV PORT=4000
CMD ["bun", "start"]