import { injectable } from "inversify";

import { JobInterface } from "./job.interface";
import { SessionRepository } from "../../repositories";
import { LoggerService } from "../../services";

@injectable()
export class CleanSessionTokensJob implements JobInterface {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly logger: LoggerService,
    ) { }

    async execute(): Promise<void> {
        try {
            const amount = await this.sessionRepository.deleteExpiredTokens();
            this.logger.info(`Deleted ${amount} expired tokens`);
        } catch (err) {
            this.logger.error("Unable to delete old tokens", err);
        }
    }
}