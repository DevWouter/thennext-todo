describe("Tasks - Menu - Navigation", () => {
    before(() => {
        // Perform login
        cy.ensureTestAccount();

    });

    beforeEach(() => {
        cy.loginTestAccount();
        cy.visit("/tasks");
        cy.get('[data-cy=menu-button]').click();
    });

    it("Should go to homepage when logout", () => {
        cy.get('[data-cy=menu-logout]').click();
        cy.location("pathname").should("equal", "/");
    });

    it("Should go to settings page", () => {
        cy.get('[data-cy=menu-settings]').click();
        cy.location("pathname").should("match", /^\/settings\//);
    });

})
