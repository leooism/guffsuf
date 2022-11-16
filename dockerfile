FROM node:alpine:3.15

WORKDIR /app

COPY package* . 

RUN npm install

COPY . .

CMD ["node", "server.js"]