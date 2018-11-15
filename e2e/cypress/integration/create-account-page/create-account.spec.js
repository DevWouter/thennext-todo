describe("Create Account Page", () => {
    beforeEach(() => {
        cy.visit("/create-account");
    });

    it("should have a login button that navigates to the login page", () => {
        cy.get("[data-cy=username]").type("e2e@test.com");
        cy.get("[data-cy=password]").type("abcdef");

        cy.get("[data-cy=submit]").click();

        cy.location("pathname").should("equal", "/account-created");
    });
});