docker-compose exec db sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e "source /backups/last.sql" test'
