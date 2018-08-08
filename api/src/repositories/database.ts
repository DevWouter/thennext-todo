import { Connection, FieldInfo } from "mysql";
import { isArray } from "util";


export class Database {

    constructor(
        private readonly connection: Connection,
    ) {
    }

    execute(query: string | string[], values?: any): Promise<{ results: any, fields: FieldInfo[] }> {
        return new Promise((resolve, reject) => {
            if (isArray(query)) {
                query = query.join("\n");
            }

            this.connection.query(query as string, values, (error, results, fields) => {
                if (error) {
                    console.error(`ERROR WHILE EXECUTING QUERY: ${error}`);
                    console.error("-------- START OF QUERY --------");
                    console.error(query);
                    console.error("-------- END OF QUERY --------");

                    reject(error);
                }

                resolve({
                    results: results,
                    fields: fields,
                });
            });
        })
    }
}