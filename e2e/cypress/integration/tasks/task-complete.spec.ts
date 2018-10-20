describe('Task - Completion', () => {
    before(() => {
        cy.ensureTestAccount();
        cy.loginTestAccount();
        cy.visit("/tasks");
    });

    describe("Create task and complete it", () => {
        it("Given I have created a task", () => {
            cy.get("[data-cy=task-input]").type("Task to complete{enter}");
        });

        it("When I complete the task", () => {
            cy.get("app-tasklist-item").within(() => {
                cy.get("[data-cy=task-done-button]").click();
            });
        });

        it("Then no task should be visible", () => {
            cy.get('[data-cy=no-tasks-found]').should("be.visible");
        });
    });

    describe("Show completed task if filter enabled", () => {
        it("When I enable the 'show completed task' filter", () => {
            cy.get('[data-cy=menu-button]').click();
            cy.get('[data-cy=show-completed-tasks]').click();
            cy.get('[data-cy=menu-background]').click();
            cy.location("search").should("contain", "show=completed");
        });

        it("Then I should see a completed task", () => {
            cy.get("app-tasklist-item").should("contain", "Task to complete");
        });

        it("And the task should have a completed icon", () => {
            cy.get("app-tasklist-item").within(() => {
                cy.get("[data-cy=task-todo-button]").should("be.visible");
            });
        });
    });

    describe("Undo task completion", () => {
        it("When I uncomplete the task", () => {
            cy.get("app-tasklist-item").within(() => {
                cy.get("[data-cy=task-todo-button]").click();
            });
        });
        it("Then the task should have a todo-icon", () => {
            cy.get("app-tasklist-item").within(() => {
                cy.get("[data-cy=task-done-button]").should("be.visible");
            });
        });
        it("When I disable the completed task filter", () => {
            cy.get('[data-cy=menu-button]').click();
            cy.get('[data-cy=show-completed-tasks]').click();
            cy.get('[data-cy=menu-background]').click();
            cy.location("search").should("not.contain", "show=completed");
        });

        it("Then the task should remain visible", () => {
            cy.get("app-tasklist-item").should("be.visible");
        });
    });
});
