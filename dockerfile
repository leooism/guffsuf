
FROM node:alpine
WORKDIR /app

COPY package* . 

RUN npm install

COPY . .

EXPOSE 3000
RUN npm i peerjs -g

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]

CMD ["peerjs", "--port" "3001"]