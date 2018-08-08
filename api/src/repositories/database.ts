import { Connection, FieldInfo } from "mysql";


export class Database {

    constructor(
        private readonly connection: Connection,
    ) {
    }

    execute(query: string, values?: any): Promise<{ results: any, fields: FieldInfo[] }> {
        return new Promise((resolve, reject) => {
            this.connection.query(query, values, (error, results, fields) => {
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