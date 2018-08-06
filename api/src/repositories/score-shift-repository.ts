import { injectable, inject } from "inversify";


import { AccountEntity, ScoreShiftEntity } from "../db/entities";
import { Database } from "./database";

@injectable()
export class ScoreShiftRepository {
    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<ScoreShiftEntity> {
        throw new Error("Not yet implemented");
        // return (await this.db())
        //     .createQueryBuilder(ScoreShiftEntity, "scoreShift")
        //     .innerJoinAndSelect("scoreShift.owner", "account")
        //     .where("scoreShift.uuid = :uuid", { uuid: uuid })
        //     .andWhere("account.id = :id", { id: account.id })
        //     .getOne();
    }

    async byId(id: number): Promise<ScoreShiftEntity> {
        throw new Error("Not yet implemented");
        // return (await this.db())
        //     .createQueryBuilder(ScoreShiftEntity, "scoreShift")
        //     .where("scoreShift.id = :id", { id: id })
        //     .getOne();
    }

    async of(account: AccountEntity): Promise<ScoreShiftEntity[]> {
        throw new Error("Not yet implemented");
        // return (await this.db()).createQueryBuilder(ScoreShiftEntity, "scoreShift")
        //     .innerJoinAndSelect("scoreShift.owner", "account")
        //     .where("account.id = :id", { id: account.id })
        //     .getMany();
    }

    async update(entity: ScoreShiftEntity): Promise<ScoreShiftEntity> {
        throw new Error("Not yet implemented");
        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(ScoreShiftEntity, entity);
    }

    async create(entity: ScoreShiftEntity): Promise<ScoreShiftEntity> {
        throw new Error("Not yet implemented");
        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(ScoreShiftEntity, entity);
    }

    async destroy(entity: ScoreShiftEntity): Promise<ScoreShiftEntity> {
        throw new Error("Not yet implemented");
        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.remove(ScoreShiftEntity, entity);
    }
}
