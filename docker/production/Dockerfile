FROM oven/bun:1.2.0

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

ENV PORT=4000

CMD ["bun", "start"]