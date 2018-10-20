// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("ensureTestAccount", () => {
    cy.request("POST", "/api/test/seed", {});
});


Cypress.Commands.add("loginTestAccount", () => {
    cy.request("POST", "/api/session/create", {
        email: "e2e@test.com",
        password: "abcdef"
    }).then((response) => {
        if (response.isOkStatusCode) {
            console.log("Token", response.body);
            localStorage.setItem("SESSION_TOKEN", response.body.token);
        }
    });
});


