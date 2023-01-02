
FROM node:16
WORKDIR /app

COPY package* . 

RUN npm install

COPY . .


RUN npm install peer -g

EXPOSE 3000
CMD ["node", "server.js"]

