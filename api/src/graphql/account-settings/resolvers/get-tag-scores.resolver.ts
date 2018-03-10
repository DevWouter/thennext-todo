import { AccountSettings } from "../account-settings.model";
import { GraphContext } from "../../helpers";
import { TagScore } from "../tag-score.model";

export function getTagScores(obj: AccountSettings, args, context: GraphContext, info): Promise<TagScore[]> {
    console.log(obj);
    throw new Error('Not implemented');
}