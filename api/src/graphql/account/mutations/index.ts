import { changePassword } from './change-password.mutation'
import { createAccount } from './create-account.mutation'
import { changeEmail } from './change-email.mutation';

export const AccountMutation = {
    createAccount: createAccount,
    changePassword: changePassword,
    changeEmail: changeEmail
}

