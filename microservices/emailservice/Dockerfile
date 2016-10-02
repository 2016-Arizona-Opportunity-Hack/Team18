FROM node:argon

ENV NODE_ENV development
RUN mkdir -p /usr/app/opphack/microservices/emailservice
WORKDIR /usr/app/opphack/microservices/emailservice
COPY package.json /usr/app/opphack/microservices/emailservice/
RUN npm install
COPY . /usr/app/opphack/microservices/emailservice
EXPOSE 3000
CMD [ "node", "index.js" ]
