FROM node:4

ENV REFRESHED 2015-12-18
ENV NODE_PATH /usr/local/lib/node_modules/emailservice/node_modules/
VOLUME ["/opt/app"]
WORKDIR "/opt/app"
ADD package.json /opt/app/package.json
RUN npm install --global
EXPOSE 3000
CMD npm start
