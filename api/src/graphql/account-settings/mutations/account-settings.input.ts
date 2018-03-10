
export interface TagScoreInput {
    readonly name: string;
    readonly value: number;
}

export interface DecaySpeedInput {
    readonly from: number;
    readonly coefficient: number;
}

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