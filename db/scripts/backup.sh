DATE=`date +%Y%m%d-%H%M%S`

# Remove file
rm backups/last.sql

# Create backup
docker-compose exec db sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --result-file="/backups/last.sql" --databases test'

# Then rename the file and create a sym-link
(
    cd backups
    mv last.sql backup-$DATE.sql
    ln -s backup-$DATE.sql last.sql
)