FROM nginx:alpine

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY ./target.tar.gz /usr/share/nginx/html/target.tar.gz

CMD tar zxf ./target.tar.gz && nginx -g "daemon off;" && rm -f ./target.tar.gz



