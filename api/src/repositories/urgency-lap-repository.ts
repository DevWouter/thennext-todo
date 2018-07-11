import { injectable, inject } from "inversify";
import { Connection } from "typeorm";
import { UrgencyLapEntity } from "../db/entities/urgency-lap.entity";
import { AccountEntity } from "../db/entities/account.entity";

@injectable()
export class UrgencyLapRepository {
    private readonly db: Promise<Connection>;
    constructor(
        @inject("ConnectionProvider") dbPromise: () => Promise<Connection>
    ) {
        this.db = dbPromise();
    }

    async byUuid(uuid: string, account: AccountEntity): Promise<UrgencyLapEntity> {
        return (await this.db)
            .createQueryBuilder(UrgencyLapEntity, "urgencyLap")
            .innerJoinAndSelect("urgencyLap.owner", "owner")
            .where("urgencyLap.uuid = :uuid")
            .andWhere("owner.id = :accountId")
            .setParameters({
                accountId: account.id,
                uuid: uuid
            })
            .getOne();
    }

    async of(account: AccountEntity): Promise<UrgencyLapEntity[]> {
        return (await this.db)
            .createQueryBuilder(UrgencyLapEntity, "urgencyLap")
            .innerJoin("urgencyLap.owner", "owner")
            .andWhere("owner.id = :accountId")
            .setParameters({
                accountId: account.id,
            }).getMany();
    }

    async update(entity: UrgencyLapEntity): Promise<UrgencyLapEntity> {
        const entityManager = (await this.db).createEntityManager();
        return entityManager.save(UrgencyLapEntity, entity);
    }

    async create(entity: UrgencyLapEntity): Promise<UrgencyLapEntity> {
        const entityManager = (await this.db).createEntityManager();
        return entityManager.save(UrgencyLapEntity, entity);
    }

    async destroy(entity: UrgencyLapEntity): Promise<UrgencyLapEntity> {
        const entityManager = (await this.db).createEntityManager();
        return entityManager.remove(UrgencyLapEntity, entity);
    }
}
