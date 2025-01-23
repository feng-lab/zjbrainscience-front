FROM mixbio-images-registry-1-registry.cn-hangzhou.cr.aliyuncs.com/ops/nginx:alpine

COPY dist/ /usr/share/nginx/html/
# FROM mixbio-images-registry-1-registry.cn-hangzhou.cr.aliyuncs.com/ops/node:16.16.0-alpine3.16

# WORKDIR /zjbrainscience-front

# COPY . .

# RUN npm install
 
# CMD ["npm", "run", "dev"]

# FROM nginx:alpine

# COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# WORKDIR /usr/share/nginx/html
# RUN rm -rf ./*

# COPY ./target.tar.gz /usr/share/nginx/html/target.tar.gz

# CMD tar zxf ./target.tar.gz && nginx -g "daemon off;" && rm -f ./target.tar.gz



