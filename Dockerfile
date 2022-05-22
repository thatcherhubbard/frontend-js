FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY server.js .
EXPOSE 8080
USER 1001
CMD [ "node", "server.js" ]
