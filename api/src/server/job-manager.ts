import { injectable } from "inversify";
import {
    JobInterface,

    CleanSessionTokensJob,
    CleanConfirmationTokensJob,
} from "./jobs";

interface JobConfig {
    /**
     * Should run every _x_ minutes
     */
    intervalMinutes: number;

    /**
     * Should run at start.
     */
    atBoot: boolean;
}


@injectable()
export class JobManager {
    constructor(
        private readonly cleanSessionTokensJob: CleanSessionTokensJob,
        private readonly cleanConfirmationTokensJob: CleanConfirmationTokensJob,
    ) {
        // Clean sessions and confirmations tokens every hour and at startup
        this.schedule(this.cleanSessionTokensJob, { atBoot: true, intervalMinutes: 60 });
        this.schedule(this.cleanConfirmationTokensJob, { atBoot: true, intervalMinutes: 60 });
    }

    private schedule(job: JobInterface, config: Partial<JobConfig>) {
        if (config.intervalMinutes) {
            setInterval(async () => {
                await job.execute();
            }, config.intervalMinutes * 60 * 1000)
        }

        if (config.atBoot) {
            job.execute();
        }
    }
}