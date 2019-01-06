FROM node:9-alpine as builder

WORKDIR /app

COPY \
    package-lock.json \
    package.json \
    /app/

RUN \
    npm install

### Copy the content to the docker image
# Unlike the dockerfile used for development, we need the files in docker
COPY . /app/

RUN npm run build


FROM nginx:alpine as result
COPY ./nginx/web-app.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html
