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

### Don't copy the source files in the docker
## Because if we do so and delete a file, then it stays in the develop container.  
# COPY \
#     ./src \
#     /server/src/

EXPOSE 3000
CMD [ "npm", "start" ]
