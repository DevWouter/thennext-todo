import { injectable, inject } from "inversify";
import { Connection } from "typeorm";

import { AccountEntity, ScoreShiftEntity } from "../db/entities";

@injectable()
export class ScoreShiftService {
    constructor(
        @inject("ConnectionProvider") private readonly db: () => Promise<Connection>
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<ScoreShiftEntity> {
        return (await this.db())
            .createQueryBuilder(ScoreShiftEntity, "scoreShift")
            .innerJoinAndSelect("scoreShift.owner", "account")
            .where("scoreShift.uuid = :uuid", { uuid: uuid })
            .andWhere("account.id = :id", { id: account.id })
            .getOne();
    }

    async byId(id: number): Promise<ScoreShiftEntity> {
        return (await this.db())
            .createQueryBuilder(ScoreShiftEntity, "scoreShift")
            .where("scoreShift.id = :id", { id: id })
            .getOne();
    }

    async of(account: AccountEntity): Promise<ScoreShiftEntity[]> {
        return (await this.db()).createQueryBuilder(ScoreShiftEntity, "scoreShift")
            .innerJoinAndSelect("scoreShift.owner", "account")
            .where("account.id = :id", { id: account.id })
            .getMany();
    }

    async update(entity: ScoreShiftEntity): Promise<ScoreShiftEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(ScoreShiftEntity, entity);
    }

    async create(entity: ScoreShiftEntity): Promise<ScoreShiftEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(ScoreShiftEntity, entity);
    }

    async destroy(entity: ScoreShiftEntity): Promise<ScoreShiftEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.remove(ScoreShiftEntity, entity);
    }
}
