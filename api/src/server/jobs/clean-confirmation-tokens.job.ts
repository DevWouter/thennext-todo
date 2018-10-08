import { injectable } from "inversify";

import { JobInterface } from "./job.interface";
import { ConfirmationTokenRepository } from "../../repositories";
import { LoggerService } from "../../services";

@injectable()
export class CleanConfirmationTokensJob implements JobInterface {
    constructor(
        private readonly confirmationTokenRepository: ConfirmationTokenRepository ,
        private readonly logger: LoggerService,
    ) { }

    async execute(): Promise<void> {
        try {
            const amount = await this.confirmationTokenRepository.deleteExpiredTokens();
            this.logger.info(`Deleted ${amount} expired confirmation tokens`);
        } catch (err) {
            this.logger.error("Unable to delete expired confirmation tokens", err);
        }
    }
}