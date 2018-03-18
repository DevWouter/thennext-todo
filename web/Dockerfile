### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:8-alpine as builder

WORKDIR /app

COPY \
    package-lock.json \
    package.json \
    /app/

RUN \    
    npm set progress=false &&\
    npm config set depth 0 &&\
    npm cache clean --force

RUN npm install

COPY . /app/

EXPOSE 4200

CMD ["npm", "start"]
