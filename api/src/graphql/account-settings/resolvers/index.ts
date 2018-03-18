import { getDecaySpeeds } from "./get-decay-speeds.resolver";
import { getTagScores } from "./get-tag-scores.resolver";

export const AccountSettingsResolvers = {
    decaySpeeds: getDecaySpeeds,
    tagScores: getTagScores,
};
