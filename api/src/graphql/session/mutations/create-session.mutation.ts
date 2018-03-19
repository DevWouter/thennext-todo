import { GraphContext } from "../../helpers";
import { Session } from "../session.model";
import { AccountEntity, SessionEntity } from "../../../db/entities";
import * as bcrypt from "bcryptjs";
import * as moment from "moment";

export async function createSession(
    obj,
    args: { email: string, password: string },
    context: GraphContext,
    info
): Promise<Session> {

    const account = await context.entityManager.findOne(AccountEntity, <Partial<AccountEntity>>{ email: args.email });
    if (!account) {
        throw new Error("No user found");
    }

    const validPassword = await bcrypt.compare(args.password, account.password_hash);
    if (!validPassword) {
        throw new Error("Password is invalid");
    }

    // Create the session and store it.
    let session = context.entityManager.create(SessionEntity);
    session.account = account;
    session.token = await bcrypt.genSalt();
    session.expire_on = moment().add({ weeks: 3 }).toDate();
    session.created_on = moment().toDate();

    session = await context.entityManager.save(session);

    return <Session>{
        _id: session.id,
        expireAt: session.expire_on,
        token: session.token,
        ownerUuid: account.uuid,
    };
}
