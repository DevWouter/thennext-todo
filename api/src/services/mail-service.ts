import { injectable } from "inversify";

@injectable()
export class MailService {
    constructor(
    ) {
        this.setup();
    }

    private setup(): void {
    }
}
