describe("Tasks - Task Input", () => {

    describe("Default", () => {
        it("Given a new account", () => {
            // Perform login
            cy.ensureTestAccount();
            cy.loginTestAccount();
            cy.visit("/tasks");
        });

        it("Should not have any tasks", () => {
            cy.get('[data-cy=no-tasks-found]').should("be.visible");
        });
    });

    describe("Create first task", () => {
        it("When I type 'Hello' and press enter in Input", () => {
            cy.get("[data-cy=task-input]").type("Hello{enter}");
        });

        it("Then the input input should be empty", () => {
            cy.get("[data-cy=task-input]").should("not.have.text");
        });

        it("Then the task-list should contain the first task", () => {
            cy.get("app-tasklist-item").contains("Hello").should("exist");
        });
    });

    describe("Entering a second task", () => {
        it("When I type 'World' in the input", () => {
            cy.get("[data-cy=task-input]").type("World");
        });
        it("Then the 'no-tasks could be found' should be visible", () => {
            cy.get('[data-cy=no-tasks-found]').should("be.visible");
        });
        it("Then the tasklist should be empty", () => {
            cy.get("app-tasklist-item").should("have.length", 0);
        });
    });

    describe("Create the second task", () => {
        it("When I press enter in the input", () => {
            cy.get("[data-cy=task-input]").type("{enter}");
        });

        it("Then the input input should be empty", () => {
            cy.get("[data-cy=task-input]").should("not.have.text");
        });

        it("Then the tasklist should contain two items: Hello and World", () => {
            cy.get("app-tasklist-item").should("have.length", 2);
            cy.get("app-tasklist-item").contains("Hello").should("be.visible");
            cy.get("app-tasklist-item").contains("World").should("be.visible");
        });
    });

    describe("Filter for the second task", () => {
        it("When I type 'World' in the input", () => {
            cy.get("[data-cy=task-input]").type("World");
        });
        it("Then the tasklist should contain one item: World", () => {
            cy.get("app-tasklist-item").should("have.length", 1);
            cy.get("app-tasklist-item").contains("World").should("be.visible");
        });
    });

    describe("Clearing the filter shows all tasks again", () => {
        it("When I clear the filter", () => {
            cy.get("[data-cy=task-input]").type("{selectall}{backspace}");
        });

        it("Then the tasklist should contain two items: Hello and World", () => {
            cy.get("app-tasklist-item").should("have.length", 2);
            cy.get("app-tasklist-item").contains("Hello").should("be.visible");
            cy.get("app-tasklist-item").contains("World").should("be.visible");
        });
    })
})
