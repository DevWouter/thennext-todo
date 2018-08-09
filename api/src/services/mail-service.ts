import { injectable } from "inversify";

import SendGrid = require('@sendgrid/mail');

interface TemplateMap {
    "PlainMessage": { subject: string, content: string };
    "CreateAccount": { confirm_url: string };
    "PasswordRecovery": { reset_url: string };
}

const templateGuids = {
    "PlainMessage": "d-cade11b620d24d5598123b6f4414c4da",
    "CreateAccount": "d-256d9c3fd8d241438a7a57aa38faaaf7",
    "PasswordRecovery": "d-387d63b4b0b743208767442f61b380ff",
};


@injectable()
export class MailService {
    constructor(
    ) {
        this.setup();
    }

    private setup(): void {
        if (process.env.SENDGRID_API_KEY === undefined ||
            process.env.SENDGRID_API_KEY === null ||
            process.env.SENDGRID_API_KEY === ""
        ) {
            throw new Error("Please use `export SENDGRID_API_KEY='YOUR_API_KEY'` to set the key");
        }
        SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
        SendGrid.setSubstitutionWrappers('{{', '}}'); // Configure the substitution tag wrappers globally
    }

    async sendMessage<K extends keyof TemplateMap>(
        template: K,
        to: string,
        templateData: TemplateMap[K]
    ): Promise<boolean> {
        const msg = {
            to: to,
            from: 'messages@thennext.com',
            templateId: templateGuids[template],
            substitutionWrappers: ['{{', '}}'],
            dynamicTemplateData: templateData,
        };
        try {
            await SendGrid.send(msg);
            return true;
        } catch (error) {
            console.error("Unable to send mail", error);
            return false;
        }

    }
}
