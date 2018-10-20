describe("Tasks - Task Input", () => {
    before(() => {
        // Perform login
        cy.ensureTestAccount();
        cy.loginTestAccount();
        cy.visit("/tasks");
    });

    it("Should show by default 'no tasks could be found'", () => {
        cy.get('[data-cy=no-tasks-found]').should("be.visible");
    });

    it("Should create a task (first)", () => {
        cy.get("[data-cy=task-input]").type("Hello{enter}");
        cy.get("[data-cy=task-input]").should("not.have.text");
        cy.contains("Hello").should("be.visible");
    });

    it("Should show 'no tasks could be found' when searching for another task name", () => {
        cy.get("[data-cy=task-input]").type("World");
        cy.get('[data-cy=no-tasks-found]').should("be.visible");
    });

    it("Should create a task (second)", () => {
        cy.get("[data-cy=task-input]").type("{enter}");
        cy.get("[data-cy=task-input]").should("not.have.text");
        cy.contains("World").should("be.visible");
    });

    it("Should only show the second task when filtering for the second task", () => {
        cy.get("[data-cy=task-input]").type("World");
        cy.get("[data-cy=task-list-container]")
            .get("app-tasklist-item")
            .should("have.length", 1);
    });
})
