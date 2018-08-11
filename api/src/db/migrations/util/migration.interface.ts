import { Migrator } from "./Migrator";

export interface MigrationInterface {
    /**
     * The name of the migration. "Should" be the same as file name.
     */
    readonly name: string;
    /**
     * 
     * @param migrator The migrator which can be used to perform upgrades.
     */
    up(migrator: Migrator): Promise<void>;
    /**
     * 
     * @param migrator The migrator which can be used to perform downgrades.
     */
    down(migrator: Migrator): Promise<void>;
}