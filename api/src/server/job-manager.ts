import { injectable } from "inversify";
import {
    JobInterface,

    CleanSessionTokensJob,
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
    ) {
        // Clean sessions should be executed once every hour.
        this.schedule(this.cleanSessionTokensJob, { atBoot: true, intervalMinutes: 60 });
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