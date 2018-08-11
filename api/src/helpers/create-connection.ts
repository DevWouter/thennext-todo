import { createConnection } from "mysql";
export function CreateDatabaseConnection() {
    return createConnection({
        host: "db",
        port: 3306,
        user: "test",
        password: "test",
        database: "test",
        charset: "utf8mb4_unicode_ci",
    });
}
