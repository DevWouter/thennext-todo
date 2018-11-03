import { skip } from "rxjs/operators";
import { Repository, RepositoryEventHandler } from "./repository";
import { Entity } from "../../models/entity";
import { exec } from "child_process";
import { EntityMessenger } from "./entity-messenger";

interface FakeEntity extends Entity {
  name: string;
}

describe('Repository', () => {
  let messenger: jasmine.SpyObj<EntityMessenger<FakeEntity>>;
  let eventHandler: jasmine.SpyObj<RepositoryEventHandler<FakeEntity>>;
  let repository: Repository<FakeEntity>;

  beforeEach(() => {
    eventHandler = jasmine.createSpyObj<RepositoryEventHandler<FakeEntity>>("EventHandler", ["onRevive"]);
    messenger = jasmine.createSpyObj<EntityMessenger<FakeEntity>>("EntityMessenger", ["setup", "sendCreate"]);
    repository = new Repository<FakeEntity>(eventHandler, messenger);
  });

  it('should exist', () => {
    expect(repository).toBeTruthy();
  });

  it("should have no items to begin with", (done) => {
    repository.entries.subscribe(entries => {
      expect(entries.length).toBe(0);
      done();
    });
  });

  it(`should create an entity when entity-created is received that is not an echo`, (done) => {
    repository.entries.pipe(skip(1))
      .subscribe(entries => {
        expect(entries.length).toBe(1);
        done();
      });

    repository.onEntityCreated({ uuid: "abcdef", name: "Albert" }, { echo: false });
  });


  it(`should update an entity when entity-updated is received`, (done) => {
    repository.entries.pipe(skip(3))
      .subscribe(entries => {
        expect(entries.length).toBe(2);
        expect(entries.find(x => x.uuid === "abcdef").name).toBe("Beatrice");
        done();
      });

    repository.onEntityCreated({ uuid: "abcdef", name: "Albert" }, { echo: false });
    repository.onEntityCreated({ uuid: "ghijklm", name: "Cecil" }, { echo: false });
    repository.onEntityUpdated({ uuid: "abcdef", name: "Beatrice" }, { echo: false });
  });

  it(`should remove an entity when entity-deleted is received`, (done) => {
    repository.entries.pipe(skip(2))
      .subscribe(entries => {
        expect(entries.length).toBe(0);
        done();
      });

    repository.onEntityCreated({ uuid: "abcdef", name: "Albert" }, { echo: false });
    repository.onEntityDeleted("abcdef", { echo: false });
  });

  it(`should replace all the entries when entities-synced was called`, (done) => {
    repository.entries.pipe(skip(2)) // Skip empty and the first create
      .subscribe(entries => {
        expect(entries.length).toBe(2);
        expect(entries.map(x => x.uuid)).toContain("abcdef");
        expect(entries.map(x => x.uuid)).toContain("ghijkl");
        done();
      });

    repository.onEntityCreated({ uuid: "abcdef_1", name: "Albert" }, { echo: false });
    repository.onEntitiesSynced([
      { uuid: "abcdef", name: "Albert" },
      { uuid: "ghijkl", name: "Beatrice" }
    ], { echo: false });
  });

  it(`should not update an item if it doesn't exist`, (done) => {
    repository.onEntityUpdated({ uuid: "non existing", name: "nope" }, { echo: false });

    repository.entries.subscribe(entries => {
      expect(entries.length).toBe(0);
      done();
    });
  });

  it(`should not delete an item if it doesn't exist`, (done) => {
    repository.onEntityCreated({ uuid: "abcdef", name: "Albert" }, { echo: false });
    repository.onEntityDeleted("non existing", { echo: false });

    repository.entries.subscribe(entries => {
      expect(entries.length).toBe(1, "it should not delete items that don't exist");
      expect(entries[0].uuid).toBe("abcdef");
      done();
    });
  });

  it(`should call the \`onRevive\` for entity-created`, () => {
    const entity = { uuid: "abcdef", name: "Albert" };
    repository.onEntityCreated(entity, { echo: false });
    expect(eventHandler.onRevive).toHaveBeenCalledTimes(1);
    expect(eventHandler.onRevive).toHaveBeenCalledWith(entity);
  });

  it(`should call the \`onRevive\` for entity-updated`, () => {
    const entity = { uuid: "abcdef", name: "Albert" };
    const entity2 = { uuid: "abcdef", name: "Beatrice" };
    repository.onEntityCreated(entity, { echo: false });
    repository.onEntityUpdated(entity2, { echo: false });
    expect(eventHandler.onRevive).toHaveBeenCalledTimes(2);
    expect(eventHandler.onRevive).toHaveBeenCalledWith(entity2);
  });

  it(`should not call the \`onRevive\` for entity-updated when the entity is not in the system`, () => {
    const entity = { uuid: "abcdef", name: "Albert" };
    repository.onEntityUpdated(entity, { echo: false });
    expect(eventHandler.onRevive).toHaveBeenCalledTimes(0);
  });

  it(`should call the \`onRevive\` for each item received when entity-synced occurs`, () => {
    const entity1 = { uuid: "abcdef", name: "Albert" };
    const entity2 = { uuid: "abcdef", name: "Beatrice" };

    repository.onEntitiesSynced([entity1, entity2], { echo: false });

    expect(eventHandler.onRevive).toHaveBeenCalledTimes(2);
    expect(eventHandler.onRevive).toHaveBeenCalledWith(entity1);
    expect(eventHandler.onRevive).toHaveBeenCalledWith(entity2);
  });

  it(`should throw an error if the same uuid was created twice using entity-created`, () => {
    // Setup
    const entity = { uuid: "abcdef", name: "Albert" };

    // Create a bad revive handler.
    eventHandler.onRevive.and.callFake((x) => { x.uuid = "wrong"; });

    // define the call
    const call = () => {
      repository.onEntityCreated(entity, { echo: false });
    };

    expect(call).toThrowError("The `onRevive` of the EventHandler is not allowed to change the uuid of an entity");
  });

  it(`should throw an error if the same uuid was created twice using entitites-synced`, () => {
    // Setup
    const entity = { uuid: "abcdef", name: "Albert" };

    // Create a bad revive handler.
    eventHandler.onRevive.and.callFake((x) => { x.uuid = "wrong"; });

    // define the call
    const call = () => {
      repository.onEntitiesSynced([entity], { echo: false });
    };

    expect(call).toThrowError("The `onRevive` of the EventHandler is not allowed to change the uuid of an entity");
  });

  it(`should throw error if the event handler changes the uuid during entity-updated`, () => {
    // Setup
    const entity = { uuid: "abcdef", name: "Albert" };
    repository.onEntitiesSynced([entity], { echo: false });

    // Create a bad revive handler.
    eventHandler.onRevive.and.callFake((x) => { x.uuid = "wrong"; });

    // define the call
    const call = () => {
      repository.onEntityUpdated(entity, { echo: false });
    };

    expect(call).toThrowError("The `onRevive` of the EventHandler is not allowed to change the uuid of an entity");
  });

  it("should not invoke revive unless provided", () => {
    repository = new Repository({ onRevive: undefined }, messenger); // The onRevive handler is not defined.
    const entity = { uuid: "abcdef", name: "Albert" };
    repository.onEntityCreated(entity, { echo: false });
    expect().nothing(); // There should have been no error thrown.
  });

  it(`should not add the same entity twice through onEntityCreated`, (done) => {
    repository = new Repository({ onRevive: undefined }, messenger); // The onRevive handler is not defined.
    const entity = { uuid: "abcdef", name: "Albert" };
    const bad_entity = { uuid: "abcdef", name: "Beatrice" };
    repository.onEntityCreated(entity, { echo: false });
    repository.onEntityCreated(bad_entity, { echo: false });

    repository.entries.subscribe((entries) => {
      expect(entries.length).toBe(1);
      expect(entries[0].uuid).toBe("abcdef");
      expect(entries[0].name).toBe("Albert", "It should ignore the second entity");
      done();
    });
  });

  it("should call the setup function of EntityMessenger as soon as it is created", () => {
    expect(messenger.setup).toHaveBeenCalledTimes(1);
    expect(messenger.setup).toHaveBeenCalledWith(repository);
  });

  it("should add an entity: The returned object is the same as input", (done) => {
    const entity = <FakeEntity>{ name: "Albert" };
    messenger.sendCreate.and.callFake(() => {

      // Report back after a 10ms that an entity was created.
      setTimeout(() => {
        // console.log("Reporting the entity was created");
        repository.onEntityCreated(<FakeEntity>{ ...entity, ...{ uuid: "entity-uuid" } }, { echo: true, refId: "message-ref-id" });
      }, (10));

      // Return ref-id
      console.log("Returning the message id from the server");
      return "message-ref-id";
    });

    repository.add(entity).then(returnedEntity => {
      expect(returnedEntity).toBe(returnedEntity);
      done();
    });
  });

  it("should add an entity: The returned object has an uuid provided by server", (done) => {
    const entity = <FakeEntity>{ name: "Albert" };
    messenger.sendCreate.and.callFake(() => {

      // Report back after a 10ms that an entity was created.
      setTimeout(() => {
        repository.onEntityCreated(<FakeEntity>{ ...entity, ...{ uuid: "entity-uuid" } }, { echo: true, refId: "message-ref-id" });
      }, (10));

      // Return ref-id
      console.log("Returning the message id from the server");
      return "message-ref-id";
    });

    repository.add(entity).then(returnedEntity => {
      expect(returnedEntity.uuid).toBeDefined("since the repository should add the uuid given by the server");
      expect(returnedEntity.uuid).toBe("entity-uuid", "the uuid of the entity should match with what the server returned");
      done();
    });
  });

  // it("should add an entity", async (done) => {
  //   const entity = <FakeEntity>{ name: "Albert" };
  //   const fakeId = `fakeid-${Math.random()}`;
  //   // messenger.sendCreate.and.callFake(() => {
  //   //   return fakeId;
  //   // });



  //   try {
  //     const responseEntity = await repository.add(entity);
  //     expect(responseEntity.)
  //     expect(responseEntity).toBe(entity, "The input object should be the same");

  //     repository.entries
  //       .pipe(skip(1))
  //       .subscribe((entries) => {
  //         expect(entries.length).toBe(1);
  //         expect(entries[0]).not.toBe(responseEntity);
  //         expect(entries[0].uuid).toBeDefined("The uuid of the object should be set");
  //         expect(entries[0].name).toBe(entity.name);
  //         expect(entries[0]).toBe(responseEntity);
  //         done();
  //       });

  //     expect(eventHandler.onRevive).toHaveBeenCalledTimes(1);
  //     expect(eventHandler.onRevive).toHaveBeenCalledWith(responseEntity);


  //   } catch (reason) {
  //     fail(reason);
  //     done();
  //   }
  // });

  // throw new Error("should have a unique refId");
  // throw new Error("should have the entity-kind");
  // throw new Error("should have the data");
  // });

  // describe("should send a update-entity to the messagebus when updating a item", () => {
  //   it("should have a unique refId");
  //   it("should have the entity-kind");
  //   it("should have the data");
  // });

  // describe("should send a delete-entity to the messagebus when deleting a item", () => {
  //   it("should have a unique refId");
  //   it("should have the entity-kind");
  //   it("should have the data");
  // });

  // it("should delete item in own list only after server responds");
  // it("should add item in own list only after server responds");
  // it("should update item in own list only after server responds");
  // it("should *NOT* send delete-entity command to the server when items are deleted internal");
});
