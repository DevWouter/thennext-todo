describe("Homepage - Navigation", () => {
    beforeEach(() => {
        cy.visit("");
    });

    it("should have a login button that navigates to the login page", () => {
        cy.get("[data-cy=header-login]").click();
        cy.location("pathname").should("equal", "/login");
    });

    it("should have a create account button", () => {
        cy.get("[data-cy=create-account-button]").click();
        cy.location("pathname").should("equal", "/create-account");
    });
});