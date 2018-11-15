describe("Login Page - Login", () => {
    beforeEach(() => {
        cy.visit("/login");
    });
    it("should login", () => {
        cy.get("[data-cy=username]").type("e2e@test.com");
        cy.get("[data-cy=password]").type("abcdef");
        cy.get("[data-cy=submit]").click();

        cy.location("pathname").should("equal", "/tasks");
    });
});
