import { Connection, FieldInfo } from "mysql";
import { isArray } from "util";
import { isDate } from "moment";

export const uuidv4: () => string = require('uuid/v4');
export class Database {

    constructor(
        private readonly connection: Connection,
    ) {
    }

    async insert<T>(tablename: string, row: Partial<T>): Promise<number> {
        const propertyNames = Object.getOwnPropertyNames(row).filter(x => row[x] !== undefined);
        const query = `INSERT INTO \`${tablename}\` \n` +
            `  (${propertyNames.reduce((prev, cur) => (prev ? prev + ", " : "") + "??", undefined)}) \n` +
            `  VALUES (${propertyNames.reduce((prev, cur) => (prev ? prev + ", " : "") + "?", undefined)})`;

        const { results, fields } = await this.execute(query, [
            ...propertyNames,
            ...propertyNames.map(x => row[x]),
        ]);

        return results.insertId;
    }

    async update<T>(tablename: string,
        row: Partial<T>,
        filter: Partial<T>,
        limit: number | "all"): Promise<void> {
        const rowProperties = Object.getOwnPropertyNames(row).filter(x => row[x] !== undefined);
        const filterProperties = Object.getOwnPropertyNames(filter).filter(x => filter[x] !== undefined);
        const query = `UPDATE \`${tablename}\` \n` +
            `\n  SET ${rowProperties.reduce((prev, cur) => (prev ? prev + ", " : "") + "?? = ?", undefined)} \n` +
            `\n  WHERE 1=1 AND (${filterProperties.reduce((prev, cur) => (prev ? prev + " AND " : "") + "?? = ?", undefined)})` +
            `${limit !== "all" ? `\n  LIMIT ${limit as number}` : ''}`;

        const { results, fields } = await this.execute(query, [
            ...rowProperties.reduce((prev, cur) => [...prev, cur, row[cur]], []),
            ...filterProperties.reduce((prev, cur) => [...prev, cur, filter[cur]], [])
        ]);
    }


    async delete<T>(tablename: string, filter: Partial<T>, limit: number | "all"): Promise<number> {
        const propertyNames = Object.getOwnPropertyNames(filter).filter(x => filter[x] !== undefined);

        if (propertyNames.length === 0) {
            // In theory we could allow unfiltered rows to be allowed, but that would result in `DELETE FROM table`
            // Unless we want to delete all data, we shouldn't allow this.
            // And if we do want to delete all data in a table, there are other ways of doing it.
            throw new Error("You need to define a selector on which you delete rows");
        }

        const query = `DELETE FROM \`${tablename}\`` +
            `\n  WHERE 1=1 AND (${propertyNames.reduce((prev, cur) => (prev ? prev + " AND " : "") + "?? = ?", undefined)})` +
            `${limit !== "all" ? `\n  LIMIT ${limit as number}` : ''}`;

        const { results, fields } = await this.execute(query, propertyNames.reduce((prev, cur) => [...prev, cur, filter[cur]], []));

        // Rows deleted
        return results.affectedRows;
    }

    execute(query: string | string[], values?: any[]): Promise<{ results: any, fields: FieldInfo[] }> {
        return new Promise((resolve, reject) => {
            if (isArray(query)) {
                query = query.join("\n");
            }

            /*
            console.log("-------- START OF QUERY --------");
            console.log(this.connection.format(query, values));
            console.log("-------- END OF QUERY --------");
            // */

            this.connection.query(query as string, values, (error, results, fields) => {
                if (error) {
                    console.error(`ERROR WHILE EXECUTING QUERY: ${error}`);
                    console.error("-------- START OF QUERY --------");
                    console.error(query);
                    // console.error(values); // Only uncomment if you need to variables
                    console.error("-------- END OF QUERY --------");

                    reject(error);
                    return;
                }

                resolve({
                    results: results,
                    fields: fields,
                });
            });
        })
    }
}