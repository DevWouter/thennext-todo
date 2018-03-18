import { TagScore } from "./tag-score.model";
import { DecaySpeed } from "./decay-speed.model";

export interface AccountSettings {
    _id: number;
    scrollToNewTasks: boolean;
    hideScoreInTaskList: boolean;

    defaultWaitUntil: string;

    urgencyPerDay: number;
    urgencyWhenActive: number;
    urgencyWhenDescription: number;
    urgencyWhenBlocking: number;
    urgencyWhenBlocked: number;

    tagScores: TagScore[];
    decaySpeeds: DecaySpeed[];
}
