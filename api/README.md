# API

The api uses the following frameworks:

- express: As the server software
- appolo/graphql: As a method for the client to talk to the server
- typeorm: To work with the database (which will be mysql)
- inversify: To handle dependencies of services
- nodemon: To make development easy


Some rules:
- Resolvers are written as a function (since they are not class based to begin with).
- We use directive resolvers to handle right management
- We use interfaces as return values, the implementation will always be POD.
- All database entities are postfixed with "Entity"
- The graphql will be in files which are merged and shared

# Run instructions

```
cd api
npm install
npm run start:watch
```
