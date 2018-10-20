describe("Task - Block", () => {
    before(() => {
        cy.ensureTestAccount();
        cy.loginTestAccount();
        cy.visit("/tasks");
    });

    describe("Create three tasks", () => {
        ["A", "B", "C"].forEach(taskName => {
            it(`Create task "${taskName}"`, () => {
                cy.get("[data-cy=task-input]").type(`${taskName}{enter}`);
            });
        });
    });
    describe("Make task B depend on task A", () => {
        it("Select task B", () => {
            cy.get("app-tasklist-item").contains("B").click();
        });

        it("Drag task A in the 'before' of B", () => {
            let tempV = undefined;
            let dt = { setData(x, v) { tempV = v; }, getData() { return tempV; } };
            cy.get("app-tasklist-item").contains("A")
                .trigger('dragstart', { dataTransfer: dt });

            cy.get("[data-cy=task-pane-before-drop]")
                .trigger("dragover", { dataTransfer: dt })
                .trigger("drop", { dataTransfer: dt });
        });

        it("Then only task A and C are visible", () => {
            cy.get("app-tasklist-item").contains("A").should("be.visible");
            cy.get("app-tasklist-item").contains("C").should("be.visible");
            cy.get("app-tasklist-item").should("have.length", 2);
        });
    });

    describe("Make task C depend on task B", () => {
        it("Drag task C in the 'after' of B", () => {
            let tempV = undefined;
            let dt = { setData(x, v) { tempV = v; }, getData() { return tempV; } };
            cy.get("app-tasklist-item").contains("C")
                .trigger('dragstart', { dataTransfer: dt });

            cy.get("[data-cy=task-pane-after-drop]")
                .trigger("dragover", { dataTransfer: dt })
                .trigger("drop", { dataTransfer: dt });
        });

        it("Then only task A is visible", () => {
            cy.get("app-tasklist-item").contains("A").should("be.visible");
            cy.get("app-tasklist-item").should("have.length", 1);
        });
    });

    describe("Prevent task A to depend on task B (prevent child to be father)", () => {
        it("TODO");
    });

    describe("Prevent task A to depend on task C (prevent grandchild to be father)", () => {
        it("TODO");
    });
})