import { injectable } from "inversify";

@injectable()
export class PasswordCheckService {
    constructor(
    ) {
    }

    /**
     * Checks the password and returns an array of errors about the password. 
     * If the array is empty then no errors were found.
     * @param password The password that needs to be validated
     * @returns An array of errors (is empty if none are found)
     */
    validatePassword(password: string): string[] {
        const errors: string[] = [];

        if (password.length === 0) {
            errors.push("Empty password is not allowed");
        }

        if (password.trim().length !== password.length) {
            errors.push("Password can not contain whitespace at start or end");
        }

        return errors;
    }
}
