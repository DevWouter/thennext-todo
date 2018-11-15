describe("Tasks - Task Input", () => {
    before(() => {
        // Perform login
        cy.ensureTestAccount();
        cy.loginTestAccount();
        cy.visit("/tasks");
    });

    it("Should have the tasks in order of creation", () => {
        cy.get("[data-cy=task-input]").type("Hello{enter}");
        cy.get("[data-cy=task-input]").type("World{enter}");

        // Order should be: Hello, World
        cy.get("app-tasklist-item:first").should("contain", "Hello");
        cy.get("app-tasklist-item:last").should("contain", "World");
    });

    it("Should put the second task at the top when actived", () => {
        // Order should be: Hello, World
        cy.get("app-tasklist-item:first").should("contain", "Hello");
        cy.get("app-tasklist-item:last").should("contain", "World");

        // Activate the task "World"
        cy.get("app-tasklist-item:last").within(() => {
            cy.get("[data-cy=play-button]").click();
        });

        // Order should be: World, Hello
        cy.get("app-tasklist-item:first").should("contain", "World");
        cy.get("app-tasklist-item:last").should("contain", "Hello");
    });

    it("Should move the second task to the bottom when deactived", () => {
        // Order should be: World, Hello
        cy.get("app-tasklist-item:first").should("contain", "World");
        cy.get("app-tasklist-item:last").should("contain", "Hello");

        // Pause the task "World"
        cy.get("app-tasklist-item:first").within(() => {
            cy.get("[data-cy=pause-button]").click();
        });

        // Order should be: Hello, World
        cy.get("app-tasklist-item:first").should("contain", "Hello");
        cy.get("app-tasklist-item:last").should("contain", "World");
    });

    it("Should put the first task at the top when actived", () => {
        // Order should be: Hello, World
        cy.get("app-tasklist-item:first").should("contain", "Hello");
        cy.get("app-tasklist-item:last").should("contain", "World");

        // Start the task "Hello"
        cy.get("app-tasklist-item:first").within(() => {
            cy.get("[data-cy=play-button]").click();
        });

        // Order should be: Hello, World (still)
        cy.get("app-tasklist-item:first").should("contain", "Hello");
        cy.get("app-tasklist-item:last").should("contain", "World");
    });

    it("Should put the first task at the top when deactivated", () => {
        // Order should be: Hello, World
        cy.get("app-tasklist-item:first").should("contain", "Hello");
        cy.get("app-tasklist-item:last").should("contain", "World");

        // Pause the task "Hello"
        cy.get("app-tasklist-item:first").within(() => {
            cy.get("[data-cy=pause-button]").click();
        });

        // Order should be: Hello, World (still)
        cy.get("app-tasklist-item:first").should("contain", "Hello");
        cy.get("app-tasklist-item:last").should("contain", "World");
    });
})
