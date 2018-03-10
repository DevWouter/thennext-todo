# API

The api uses the following frameworks:

- express: As the server software
- appolo/graphql: As a method for the client to talk to the server
- typeorm: To work with the database (which will be mysql)
- inversify: To handle dependencies of services
- nodemon: To make development easy


Some rules:
- Resolvers are written as a function (since they are not class based to begin with).
- Resolvers are grouped by their type (so: `/account/account.graphql`, `/account/account.resolver.ts`)
- The models are stored inside a `models` folder (since we are using them everywhere)
    - They are also exported using the `index.ts` to keep things simple
    - Some models also have fields prefixed with `_` like `_id`. These are not visible in GraphQL
- We use directive resolvers to handle right management
- We use interfaces as return values, the implementation will always return an object.
- All database entities are postfixed with "Entity"
- All services are passed using the context

# Run instructions

```sh
docker-compose up -d --build
```

# Database
## Running the migrations

The migrations are run every time the container is started.

```sh
docker-compose exec api npm run orm:run-migrations
```

## Creating a new migration

```sh
# Check if there are any changes
docker-compose exec api npm run orm:changes

# Generate a migration
docker-compose exec api npm run orm:generate-migration -- --name MyMigration
```