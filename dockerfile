#Typescript Build Stage
FROM node:16.14.2-alpine3.15

WORKDIR /usr/app

RUN npm install -g pnpm@7.9.0

COPY package.json ./
COPY pnpm-lock.yaml ./

COPY ./src                   ./
COPY ./env.d.ts              ./
COPY ./.env                  ./
COPY ./nest-cli.json         ./
COPY ./tsconfig.json         ./
COPY ./tsconfig.build.json   ./
COPY ./prisma                ./

RUN pnpm install --ignore-scripts --frozen-lockfile
RUN pnpm run prisma
RUN pnpm run build

CMD ["pnpm", "start"]