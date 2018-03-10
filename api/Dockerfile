FROM node:9-alpine

WORKDIR /server

COPY \
    ./index.js \
    ./nodemon.json \
    ./ormconfig.json \
    ./package-lock.json \
    ./package.json \
    ./tsconfig.json \
    ./src/ \
    /server

RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]