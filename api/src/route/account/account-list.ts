import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { Account } from "../../models";

import { AccountEntity } from "../../db/entities";

import { TransformAccount } from "./helpers/account-to-model";

export async function AccountList(req: Request, res: Response): Promise<void> {
    const results = await getConnection()
        .createQueryBuilder(AccountEntity, "account")
        .getMany()
        .then(x => x.map(TransformAccount));
    res.send(results);
}
