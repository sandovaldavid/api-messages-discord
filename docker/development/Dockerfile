FROM oven/bun:1.2.0

WORKDIR /app

COPY package.json .

RUN bun install

COPY . .

CMD ["bun", "run", "dev"]