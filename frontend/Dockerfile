FROM node:19-alpine3.16 as builder
ENV NODE_OPTIONS=--max_old_space_size=2048
WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY . .
RUN npm run build

FROM nginx:1.16.0-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY deploy/nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
