import { MigrationInterface } from "./util";
import { Migration_20180111143204_initial_migration } from "./20180111143204-initial-migration";
import { Migration_20180812093820_add_is_confirmed } from "./20180812093820-add-is-confirmed";
import { Migration_20180812100232_add_confirmation_token_table } from "./20180812100232-add-confirmation-token-table";
import { Migration_20181008162733_add_password_recovery_table } from "./20181008162733-add-password-recovery-table";
import { Migration_20181121184426_add_privatekeyhash_to_tasklist } from "./20181121184426-add-privatekeyhash-to-tasklist";
import { Migration_20181230211754_add_time_estimate_to_task } from "./20181230211754-add-time-estimate-to-task";
import { Migration_20190104220641_remove_private_key } from "./20190104220641-remove-private-key";
import { Migration_20190105165437_remove_table_tasklist_right } from "./20190105165437-remove-table-tasklist-right";

// This const contains all the migrations in the order they need to be executed.
// They should also contain a name, which will be used to check if the migration is executed in the correct order.
export const AllMigrations: MigrationInterface[] = [
    new Migration_20180111143204_initial_migration(),
    new Migration_20180812093820_add_is_confirmed(),
    new Migration_20180812100232_add_confirmation_token_table(),
    new Migration_20181008162733_add_password_recovery_table(),
    new Migration_20181121184426_add_privatekeyhash_to_tasklist(),
    new Migration_20181230211754_add_time_estimate_to_task(),
    new Migration_20190104220641_remove_private_key(),
    new Migration_20190105165437_remove_table_tasklist_right(),
];