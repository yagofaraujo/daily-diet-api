FROM node:20-alpine as build
RUN apk update && apk add bash
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm install

### Production

FROM node:20-alpine as production
WORKDIR /app

COPY . .
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3333
ENTRYPOINT [ "npm", "run", "start" ]