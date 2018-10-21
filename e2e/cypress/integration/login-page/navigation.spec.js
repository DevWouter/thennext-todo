describe("Login Page - Navigation", () => {
    beforeEach(() => {
        cy.visit("/login");
    });

    it("should have a login button that navigates to the login page", () => {
        cy.get("[data-cy=header-login]").click();
        cy.location("pathname").should("equal", "/login");
    });

    it("should have a button to go to the home page", () => {
        cy.get("[data-cy=header-home]").click();
        cy.location("pathname").should("equal", "/");
    });

    it("should have a link to go to the password recovery page", () => {
        cy.get("[data-cy=forgot-password-link]").click();
        cy.location("pathname").should("equal", "/forget-password");
    });
});