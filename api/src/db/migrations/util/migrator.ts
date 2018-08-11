import { Connection, FieldInfo } from "mysql";

export class Migrator {
    constructor(
        private readonly connection: Connection,
    ) {
    }

    execute(query: string | string[], values?: any[]): Promise<{ results: any, fields: FieldInfo[] }> {
        if (Array.isArray(query)) {
            query = query.join("\n");
        }

        return new Promise((resolve, reject) => {
            this.connection.query(query as string, values, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve({
                    results: results,
                    fields: fields,
                });
            });
        });
    }
}