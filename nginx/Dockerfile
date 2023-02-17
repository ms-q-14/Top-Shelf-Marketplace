FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY conf/nginx.conf /etc/nginx
EXPOSE 80
ENTRYPOINT [ "nginx","-g","daemon off;"]