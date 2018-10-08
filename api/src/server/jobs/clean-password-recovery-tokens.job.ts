import { injectable } from "inversify";

import { JobInterface } from "./job.interface";
import { PasswordRecoveryTokenRepository } from "../../repositories";
import { LoggerService } from "../../services";

@injectable()
export class CleanPasswordRecoveryTokensJob implements JobInterface {
    constructor(
        private readonly passwordRecoveryTokenRepository: PasswordRecoveryTokenRepository,
        private readonly logger: LoggerService,
    ) { }

    async execute(): Promise<void> {
        try {
            const amount = await this.passwordRecoveryTokenRepository.deleteExpiredTokens();
            this.logger.info(`Deleted ${amount} expired password-recovery tokens`);
        } catch (err) {
            this.logger.error("Unable to delete expired password-recovery tokens", err);
        }
    }
}