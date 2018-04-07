#!/bin/sh
#
# The following script creates the migration. 
# It requires an that can be used to name the migration

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "1 argument required, $# provided"

docker-compose exec api npm run orm:generate-migration -- --name $1