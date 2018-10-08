import { FieldInfo } from "mysql";
import { Database } from "../../../repositories/database";

export class Migrator {
    constructor(
        private readonly database: Database,
    ) {
    }

    execute(query: string | string[], values?: any[]): Promise<{ results: any, fields: FieldInfo[] }> {
        return this.database.execute(query, values);
    }
}