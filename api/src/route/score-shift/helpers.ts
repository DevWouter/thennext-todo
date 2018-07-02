import { ScoreShift } from "../../models/score-shift.model";
import { ScoreShiftEntity } from "../../db/entities";

export function toModel(src: ScoreShiftEntity): ScoreShift {
    const result = <ScoreShift>{
        uuid: src.uuid,
        phrase: src.phrase,
        score: src.score,
        createdOn: src.created_on,
        updatedOn: src.updated_on,
    };

    return result;
}
