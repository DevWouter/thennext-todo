import { Migration_20180111143204_initial_migration } from "./20180111143204-initial-migration";
import { MigrationInterface } from "./util";
import { Migration_20180812093820_add_is_confirmed } from "./20180812093820-add-is-confirmed";

// This const contains all the migrations in the order they need to be executed.
// They should also contain a name, which will be used to check if the migration is executed in the correct order.
export const AllMigrations: MigrationInterface[] = [
    new Migration_20180111143204_initial_migration(),
    new Migration_20180812093820_add_is_confirmed(),
];