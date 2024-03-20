FROM node:20-alpine
WORKDIR /app

RUN apk update && apk add bash
RUN apk add make
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip

COPY ./package.json ./package-lock.json ./
COPY prisma ./prisma

RUN npm install

##test

COPY . .

EXPOSE 3333

ENTRYPOINT ["npm", "run", "start:dev"]
