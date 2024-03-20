FROM node:20-alpine
WORKDIR /app

RUN apk update && apk add bash

COPY ./package.json ./package-lock.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

EXPOSE 3333

ENTRYPOINT ["npm", "run", "start:dev"]
