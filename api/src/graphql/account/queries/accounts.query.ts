import { GraphContext } from "../../helpers";
import { Account } from "../account.model";
import { AccountEntity } from "../../../db/entities";

export async function accounts(obj: Account, args, context: GraphContext, info): Promise<Account[]> {
    const repo = context.entityManager.getRepository<AccountEntity>(AccountEntity);
    const results = repo.find();
    return results.then(x =>
        x.map(y => {
            return <Account>{
                _id: y.id,
                email: y.email,
                uuid: y.uuid,
            };
        })
    );
}
