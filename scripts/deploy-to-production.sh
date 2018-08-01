#!/bin/bash

# CONSTANTS
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

## CONFIG ITEMS
SERVER="thennext.com"

## PREPARATIONS
# Create folder to store docker images
if [ ! -d "${DIR}/../docks" ]; then
  mkdir ${DIR}/../docks
fi

### Create docker image
docker-compose -f docker-compose.prod-build.yml build

### Save the docker images
echo ">>> Exporting docker images"
docker save -o ${DIR}/../docks/pa_db.tar pa_db:production
docker save -o ${DIR}/../docks/pa_api.tar pa_api:production
docker save -o ${DIR}/../docks/pa_web.tar pa_web:production
docker save -o ${DIR}/../docks/pa_proxy.tar pa_proxy:production

# Upload the docker images and compose files
echo ">>> Uploading docker images"
rsync -avPz ${DIR}/../docks/pa_{db,api,web,proxy}.tar core@${SERVER}:/home/core/docks/
rsync -avPz ${DIR}/../docker-compose.prod-run.yml core@${SERVER}:/home/core/docker-compose.yml

# Run this command manually on the server: sudo ./scripts/backup.sh
echo ">>> Loading docker images"
ssh -t core@$SERVER "
# Load the images
docker load -i /home/core/docks/pa_db.tar
docker load -i /home/core/docks/pa_api.tar
docker load -i /home/core/docks/pa_web.tar
docker load -i /home/core/docks/pa_proxy.tar

# Create backup
sudo ./scripts/backup.sh

# Restart docker-compose
/opt/bin/docker-compose up -d --no-build --env-file=production.env

# Clean up old images
docker image prune -f
"

echo ">>> Release completed"
