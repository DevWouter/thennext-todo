import { AccountSettings } from "../account-settings.model";
import { GraphContext } from "../../helpers";
import { DecaySpeed } from "../decay-speed.model";

export async function getDecaySpeeds(obj: AccountSettings, args, context: GraphContext, info): Promise<DecaySpeed[]> {
    throw new Error("Not implemented");
}
