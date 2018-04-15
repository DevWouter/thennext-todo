FROM nginx:alpine

# Used for caching
# Used for the logs
RUN mkdir -p /data/nginx/cache /etc/nginx/logs

# Copy the configuration(s)
COPY \ 
    ./gzip-compression.conf \
    ./http-to-https.conf \
    ./letsencrypt.conf \
    ./location-api.conf \
    ./location-graphiql.conf \
    ./location-graphql.conf \
    ./location-root.conf \
    ./locations.conf \
    ./nginx.dev.conf \
    ./nginx.prod.conf \
    ./proxy-http.conf \
    ./proxy-https.conf \
    ./upstreams.conf \
    /etc/nginx/

# Expose the ports
EXPOSE 80
EXPOSE 443

# We can use this argument to determine if we need to use the dev or prod configuration
ARG NGINX_CONFIG

# Create symbolic link to the active configuration.
RUN ln -sf /etc/nginx/nginx.$NGINX_CONFIG.conf /etc/nginx/nginx.conf

