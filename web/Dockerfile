FROM node:9-alpine

WORKDIR /app

COPY \
    package-lock.json \
    package.json \
    /app/

# RUN \
    # npm set progress=false &&\
    # npm config set depth 0 &&\
    # npm cache clean --force

RUN \
    npm install

### Don't copy the content to the docker image.
### It should be linked instead.
# COPY . /app/

EXPOSE 4200

CMD ["npm", "start"]
