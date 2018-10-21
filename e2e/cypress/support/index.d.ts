declare namespace Cypress {
    interface Chainable<Subject = any> {
        ensureTestAccount(): void;
        loginTestAccount(): void;
    }
}
