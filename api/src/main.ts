import 'reflect-metadata'; // Required so that typeorm can read the types.

import { createConnection } from 'typeorm';
import { startServer } from './server';

// Create a database connection and then setup start the server
createConnection().then(connection => {
    startServer(connection, 3000);
})