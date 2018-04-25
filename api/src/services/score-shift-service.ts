import { injectable } from "inversify";
import { Connection } from "typeorm";

import { AccountEntity, ScoreShiftEntity } from "../db/entities";

@injectable()
export class ScoreShiftService {
    constructor(
        private readonly db: Connection
    ) { }

    byUuid(uuid: string, account: AccountEntity): Promise<ScoreShiftEntity> {
        // this function requires the account to ensure we have ownership.
        return this.db
            .createQueryBuilder(ScoreShiftEntity, "scoreShift")
            .innerJoinAndSelect("scoreShift.owner", "account")
            .where("scoreShift.uuid = :uuid", { uuid: uuid })
            .andWhere("account.id = :id", { id: account.id })
            .getOne();
    }

    byId(id: number): Promise<ScoreShiftEntity> {
        return this.db
            .createQueryBuilder(ScoreShiftEntity, "scoreShift")
            .where("scoreShift.id = :id", { id: id })
            .getOne();
    }

    of(account: AccountEntity): Promise<ScoreShiftEntity[]> {
        return this.db.createQueryBuilder(ScoreShiftEntity, "scoreShift")
            .innerJoinAndSelect("scoreShift.owner", "account")
            .where("account.id = :id", { id: account.id })
            .getMany();
    }

    update(entity: ScoreShiftEntity): Promise<ScoreShiftEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(ScoreShiftEntity, entity);
    }

    create(entity: ScoreShiftEntity): Promise<ScoreShiftEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(ScoreShiftEntity, entity);
    }

    destroy(entity: ScoreShiftEntity): Promise<ScoreShiftEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.remove(ScoreShiftEntity, entity);
    }
}
