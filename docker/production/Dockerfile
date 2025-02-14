FROM oven/bun:1.2.0

WORKDIR /app

COPY . .

RUN bun install

ENV PORT=4000

CMD ["bun", "start"]