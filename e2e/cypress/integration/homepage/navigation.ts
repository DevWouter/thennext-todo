describe("Homepage", () => {
    beforeEach(() => {
        cy.visit("");
    });

    it("should have a login button that navigates to the login page", () => {
        cy.get("#login").click();
        cy.location("pathname").should("equal", "/login");
    });

    it("should have a create account button", () => {
        cy.get("#create-account").click();
        cy.location("pathname").should("equal", "/create-account");
    });
});