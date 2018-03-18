import { AccountSettings } from "../account-settings.model";
import { GraphContext } from "../../helpers";
import { TagScore } from "../tag-score.model";

export async function getTagScores(obj: AccountSettings, args, context: GraphContext, info): Promise<TagScore[]> {
    throw new Error("Not implemented");
}
