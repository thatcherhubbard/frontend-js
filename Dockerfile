FROM registry.access.redhat.com/ubi8/nodejs-14:latest
USER root
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
USER 1001
EXPOSE 8080
CMD [ "node", "server.js" ]
# docker build -t voravitl/frontend-js:latest .
# docker tag  voravitl/frontend-js:latest quay.io/voravitl/frontend-js:latest
# docker push quay.io/voravitl/frontend-js:latest
