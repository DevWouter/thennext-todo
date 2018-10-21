describe("Create Account Page - Navigation", () => {
    beforeEach(() => {
        cy.visit("/create-account");
    });

    it("should have a login button that navigates to the login page", () => {
        cy.get("[data-cy=header-login]").click();
        cy.location("pathname").should("equal", "/login");
    });

    it("should have a button button to the home page", () => {
        cy.get("[data-cy=header-home]").click();
        cy.location("pathname").should("equal", "/");
    });
});