FROM node:19-alpine3.16 as builder


WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm install
RUN apk update
RUN apk add
RUN apk add ffmpeg

COPY . /usr/src/app


EXPOSE 3003 1935 8888

CMD [ "node", "server.js" ]

