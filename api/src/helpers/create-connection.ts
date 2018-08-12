import { createConnection } from "mysql";
export function CreateDatabaseConnection() {
    return createConnection({
        host: "db",
        port: 3306,
        user: "test",
        password: "test",
        database: "test",
        charset: "utf8mb4_unicode_ci",
        typeCast: function (field, next) {
            // handle only BIT(1)
            if (field.type == "BIT" && field.length == 1) {
                var bit = field.string();

                return (bit === null) ? null : bit.charCodeAt(0);
            }

            // handle everything else as default
            return next();
        }
    });
}
