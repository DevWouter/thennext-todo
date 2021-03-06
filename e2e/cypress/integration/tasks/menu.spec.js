describe("Tasks - Menu", () => {
    before(() => {
        // Perform login
        cy.ensureTestAccount();
        cy.loginTestAccount();
        cy.visit("/tasks");
    });

    it("Should open the menu on click", () => {
        cy.get('[data-cy=menu-button]').click();
        cy.wait(400);
        cy.get('[data-cy=menu]').should("be.visible");
        cy.get('.mat-drawer-backdrop').should("be.visible");
    });

    it("Should not close the menu when toggling the filters", () => {
        cy.get('[data-cy=show-blocked-tasks]').click();
        cy.get('[data-cy=show-negative-tasks]').click();
        cy.get('[data-cy=show-completed-tasks]').click();
        cy.get('[data-cy=menu]').should("be.visible");
    });

    it("Should close the menu when click on background of menu", () => {
        cy.get('.mat-drawer-backdrop').click();
        cy.get('[data-cy=menu]').should("be.hidden");
        cy.get('.mat-drawer-backdrop').should("be.hidden");
    });

    it("Should close the menu when navigating to another task", () => {
        cy.get('[data-cy=menu-button]').click();
        cy.wait(500);
        cy.get('[data-cy=tasklist-selector]').select("list 2");
        cy.get('[data-cy=menu]').should("be.hidden");
        cy.wait(500);
        cy.get('.mat-drawer-backdrop').should("be.hidden");
    });

})
