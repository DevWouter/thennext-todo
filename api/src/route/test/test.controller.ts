import { Response, Request } from "express";
import { injectable } from "inversify";
import * as bcrypt from "bcryptjs";
import { SecurityConfig } from "../../config";

import { LoggerService } from "../../services";
import {
    AccountRepository,
    TaskListRepository,
    AccountSettingsRepository,
    UrgencyLapRepository,
} from "../../repositories";


@injectable()
export class TestController {
    constructor(
        private readonly logger: LoggerService,
        private readonly accountRepository: AccountRepository,
        private readonly taskListRepository: TaskListRepository,
        private readonly accountSettingsRepository: AccountSettingsRepository,
        private readonly urgencyLapRepository: UrgencyLapRepository,
    ) {
    }

    async seed(req: Request, res: Response): Promise<void> {
        this.logger.info("Starting the seed process");

        // Delete the test user and delete all it's tasklists, then create the default.
        await this.deleteAccount("e2e@test.com");
        await this.seedAccount("e2e@test.com", "abcdef");

        res.sendStatus(200);
    }

    async deleteAccount(email: string): Promise<void> {
        const account = await this.accountRepository.byEmail(email);
        if (!account) {
            this.logger.info("The test account doesn't exists, nothing to delete");
            return; // Account
        }

        const lists = await this.taskListRepository.for(account);
        const ownedLists = lists.filter(x => x.ownerId !== account.id);
        // Wait untill all rights have been deleted.
        await Promise.all(ownedLists.map(l => this.taskListRepository.destroy(l)));

        await this.accountRepository.destroy(account);
    }

    async seedAccount(email: string, password: string): Promise<void> {
        // Create account
        const account = await this.accountRepository.create(
            email,
            await bcrypt.hash(password, SecurityConfig.saltRounds)
        );

        account.is_confirmed = true; // Enforce it was created.
        await this.accountRepository.update(account);

        // Create tasklist and the right for the tasklist.
        const primaryTaskList = await this.taskListRepository.create("Inbox", account);
        const secondaryList = await this.taskListRepository.create("list 2", account);

        // Create settings
        await this.accountSettingsRepository.create(account, primaryTaskList);

        // Create the default urgency laps
        const options = [
            { from: 0, score: 1.5 },
            { from: 7, score: 1.0 },
            { from: 14, score: 0.5 },
            { from: 21, score: 0.0 }
        ];

        options.forEach(async (x) => {
            await this.urgencyLapRepository.create(account, x.from, x.score);
        });
    }
}
