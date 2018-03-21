import { GraphContext } from "../../helpers";
import { Session } from "../session.model";
import { SessionEntity } from "../../../db/entities";
import * as moment from "moment";

export async function extendSession(obj, args: { token: string }, context: GraphContext, info): Promise<Session> {
    // Also load the account.
    let session = await context.entityManager.findOne(SessionEntity,
        {
            where: { token: args.token },
            relations: ["account"]
        }
    );
    if (!session) {
        throw new Error("Session not found");
    }

    // Increase the expire timeout.
    session.expire_on = moment().add({ weeks: 3 }).toDate();

    // Store the session
    session = await context.entityManager.save(session);
    return <Session>{
        _id: session.id,
        expireAt: session.expire_on,
        token: session.token,
        ownerUuid: session.account.uuid,
    };
}
