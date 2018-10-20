describe("Tasks - Filter", () => {
    before(() => {
        cy.ensureTestAccount();
    });

    beforeEach(() => {
        // Perform login
        cy.loginTestAccount();
        cy.visit("/tasks");
        cy.get('[data-cy=menu-button]').click();
    });

    it("Should store blocked task filter in list", () => {
        cy.get('[data-cy=show-blocked-tasks]').click();
        cy.location("search").should("contain", "show=blocked");
    });

    it("Should store negative task filter in list", () => {
        cy.get('[data-cy=show-negative-tasks]').click();
        cy.location("search").should("contain", "show=negative");
    });

    it("Should store completed task filter in list", () => {
        cy.get('[data-cy=show-completed-tasks]').click();
        cy.location("search").should("contain", "show=completed");
    });
})
