FROM node:20 AS local

WORKDIR /usr/src/app

COPY package*.json tsconfig*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD node dist/main

EXPOSE 3000
