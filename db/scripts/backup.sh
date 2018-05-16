DATE=`date +%Y%m%d-%H%M%S`

# Remove file
if [ -e backups/last.sql ]; then
  rm backups/last.sql
else
  echo "no earlier backup was found"
fi

# Create backup
docker-compose exec db sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --result-file="/backups/last.sql" --databases test'

if [ ! -e backups/last.sql ]; then
  echo "WARNING! Backup has failed"
  exit 1
fi

# Then rename the file and create a sym-link
(
    cd backups
    mv last.sql backup-$DATE.sql
    ln -s backup-$DATE.sql last.sql
)