import { TagScoreInput } from "./tag-score.input";
import { DecaySpeedInput } from "./decay-speed.input";

export interface AccountSettingsInput {
    readonly scrollToNewTasks?: boolean;
    readonly hideScoreInTaskList?: boolean;
    readonly defaultWaitUntil?: string;
    readonly urgencyPerDay?: number;
    readonly urgencyWhenActive?: number;
    readonly urgencyWhenDescription?: number;
    readonly urgencyWhenBlocking?: number;
    readonly urgencyWhenBlocked?: number;

    readonly tagScores?: TagScoreInput[];
    readonly decaySpeeds?: DecaySpeedInput[];
}
