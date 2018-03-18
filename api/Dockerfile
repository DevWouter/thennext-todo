FROM node:9-alpine

WORKDIR /server

COPY \
    ./package.json \
    ./package-lock.json \
    /server/

RUN npm install

COPY \
    ./index.js \
    ./nodemon.json \
    ./ormconfig.json \
    ./tsconfig.json \
    /server/

COPY \
    ./src \
    /server/src/

EXPOSE 3000
CMD [ "npm", "start" ]
