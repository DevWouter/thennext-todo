import { Repository } from "./repository";
import { Entity } from "../../models/entity";
import { Subscription, Subject, combineLatest } from "rxjs";
import { filter, skip, take } from "rxjs/operators";
import { EntityMessageSenderInterface } from "./entity-message-sender";
import { EntityMessageReceiverInterface } from "./entity-message-receiver";

interface UserFake extends Entity {
  name: string;
}

describe('Repository', () => {
  let userWouter: UserFake;
  let repository: Repository<UserFake>;
  let sender: jasmine.SpyObj<EntityMessageSenderInterface<UserFake>>;
  let receiver: jasmine.SpyObj<EntityMessageReceiverInterface<UserFake>>;
  let postActions: (() => Promise<void>)[];

  let $sendAdd: Subject<UserFake>;
  let $sendUpdate: Subject<UserFake>;
  let $sendRemove: Subject<void>;
  let $sendSync: Subject<UserFake[]>;


  let $receiveAdd: Subject<{ data: UserFake }>;
  let $receiveUpdate: Subject<{ data: UserFake }>;
  let $receiveRemove: Subject<{ uuid: string }>;

  function _autoUnsub(sub: Subscription) {
    postActions.push(async () => { sub.unsubscribe(); });
  }

  function withUserInRepository(user: UserFake, callback: () => void) {
    const sub = repository.add(user).subscribe(() => {
      callback();
    });
    _autoUnsub(sub);

    $sendAdd.next({ ...user, ... { uuid: "user-01" } });
    return sub;
  }

  beforeEach(() => {
    postActions = [];
    userWouter = <UserFake>{ name: "Wouter" };

    $sendAdd = new Subject<UserFake>();
    $sendUpdate = new Subject<UserFake>();
    $sendRemove = new Subject<void>();
    $sendSync = new Subject<UserFake[]>();

    sender = jasmine.createSpyObj<EntityMessageSenderInterface<UserFake>>(
      "EntityMessageSender",
      ["add", "update", "remove", "sync"]
    );

    sender.add.and.returnValue($sendAdd);
    sender.update.and.returnValue($sendUpdate);
    sender.remove.and.returnValue($sendRemove);
    sender.sync.and.returnValue($sendSync);

    $receiveAdd = new Subject<{ data: UserFake }>();
    $receiveUpdate = new Subject<{ data: UserFake }>();
    $receiveRemove = new Subject<{ uuid: string }>();

    receiver = jasmine.createSpyObj<EntityMessageReceiverInterface<UserFake>>(
      "EntityMessageReceiver",
      ["onAdd", "onRemove", "onUpdate"]
    );

    receiver.onAdd.and.returnValue($receiveAdd);
    receiver.onUpdate.and.returnValue($receiveUpdate);
    receiver.onRemove.and.returnValue($receiveRemove);

    repository = new Repository<UserFake>(sender, receiver);
  });

  afterEach((done) => {
    const allPromise = Promise.all(postActions);
    allPromise
      .then(() => { done(); })
      .catch(reasons => { throw reasons; });
  });

  describe("add-function", () => {
    it("should have an empty entries list on start", (done) => {
      repository.entities.subscribe(entries => {
        expect(entries.length).toBe(0);
        done();
      })
    });

    it('should send a message when adding entity', () => {
      repository.add(userWouter);
      const messengerArgs = sender.add.calls.mostRecent().args;
      expect(messengerArgs[0]).toBe(userWouter, "first argument should be the entity");
    });

    it("should thrown an error when adding an entity that has an uuid to the repository", () => {
      userWouter.uuid = "not-allowed"
      const call = () => { repository.add(userWouter); };
      expect(call).toThrowError("The entity has an uuid, which is not allowed when adding");
    });

    it('should return an observable that will resolve when server replies', (done) => {
      _autoUnsub(
        repository.add(userWouter)
          .subscribe((entity) => {
            expect(entity).toBeDefined();
            expect(entity).toBe(userWouter, "since we expect the original object to be returned and not ths server value");
            expect(entity.uuid).toBe("user-01", "because the server should provide an UUID");
            done();
          })
      );

      $sendAdd.next({ ...userWouter, ... { uuid: "user-01" } });
    });

    it("should *not* add an entity to the local repository *before* the server responds", (done) => {
      repository.add(userWouter);

      _autoUnsub(repository.entities
        .subscribe(entries => {
          expect(entries.length).toBe(0, "since the server has yet to respond there should be no entries");
          done();
        }));
    });

    it("should add an entity to the local repository *after* the server responds", (done) => {
      repository.add(userWouter);
      $sendAdd.next({ ...userWouter, ... { uuid: "user-01" } });

      _autoUnsub(repository.entities
        .subscribe(entries => {
          expect(entries[0]).toBe(userWouter, "since the server has responded there should be 1 entry");
          done();
        }));
    });
  });

  describe("update-function", () => {
    it('should send a message when updating entity', (done) => {
      withUserInRepository(userWouter, () => {
        repository.update(userWouter);
        const messengerArgs = sender.update.calls.mostRecent().args;
        expect(messengerArgs[0]).toBe(userWouter, "first argument should be the entity");
        done();
      });
    });

    it('should return an observable that will resolve when server replies', (done) => {
      withUserInRepository(userWouter, () => {
        _autoUnsub(repository.update(userWouter)
          .subscribe((entity) => {
            expect(entity).toBeDefined();
            expect(entity).toBe(userWouter, "since we expect the original object to be returned and not ths server value");
            done();
          })
        );

        $sendUpdate.next({ ...userWouter });
      });
    });

    // Unlike `add` and `remove` then `update` function will result in an instant update.
    // This is because the user might be typing (which results in multiple updates) and
    // as such all updates are send through.
    it("should update the entities observable before the server responds with an update", (done) => {
      withUserInRepository(userWouter, () => {
        _autoUnsub(repository.entities
          .pipe(skip(1)) // Skip the initial state.
          .subscribe(() => {
            expect().nothing();
            done();
          }));

        repository.update(userWouter);
      });
    });

    it("should thrown an error when updating an entity that is missing an uuid to the repository", () => {
      userWouter.uuid = undefined;
      const call = () => { repository.update(userWouter); }
      expect(call).toThrowError("The entity is missing an uuid");
    });

    it("should thrown an error when updating an entity whose uuid is unknown the repository", () => {
      userWouter.uuid = "unknown-uuid";
      const call = () => { repository.update(userWouter); }
      expect(call).toThrowError("The entity is unknown in storage");
    });
  });

  describe("remove-function", () => {
    it('should send a message when removing entity', (done) => {
      withUserInRepository(userWouter, () => {
        repository.remove(userWouter);
        const messengerArgs = sender.remove.calls.mostRecent().args;
        expect(messengerArgs[0]).toBe(userWouter, "first argument should be the entity");
        done();
      });
    });

    it('The remove function returns an observable that will resolve when server replies', (done) => {
      withUserInRepository(userWouter, () => {
        let obs = repository.remove(userWouter);
        _autoUnsub(obs.subscribe((entity) => {
          expect(entity).toBeUndefined("since we expect the remove function to actually remove the entity");
          done();
        }));

        $sendRemove.next();
      });
    });

    it("should update the entities observable when the server responds with an remove", (done) => {
      withUserInRepository(userWouter, () => {
        repository.remove(userWouter);

        const sub = repository.entities
          .pipe(skip(1)) // Skip initial state
          .subscribe(entries => {
            expect(entries.length).toBe(0, "since we have removed all the entities");
            done();
          });

        _autoUnsub(sub);

        $sendRemove.next();
      });
    });

    it("should thrown an error when removing an entity that is missing an uuid from the repository", () => {
      userWouter.uuid = undefined;
      const call = () => { repository.remove(userWouter); }
      expect(call).toThrowError("The entity is missing an uuid");
    });

    it("should thrown an error when removing an entity whose uuid is unknown to the repository", () => {
      userWouter.uuid = "unknown-uuid";
      const call = () => { repository.remove(userWouter); }
      expect(call).toThrowError("The entity is unknown in storage");
    });

    it("Should not remove twice", (done) => {
      repository.add({ ...userWouter });
      $sendAdd.next({ ...userWouter, ... { uuid: "user-01" } });

      _autoUnsub(repository.add(userWouter).subscribe(() => {
        repository.remove(userWouter);
        repository.remove(userWouter);

        $sendRemove.next();
        $sendRemove.next();

        const sub = repository.entities
          .subscribe((entries) => {
            expect(entries.length).toBe(1, "since we have only removed 1 (even thoughwe used two calls");
            done();
          });

        _autoUnsub(sub);
      }));

      $sendAdd.next({ ...userWouter, ... { uuid: "user-02" } });
    });
  });

  describe("sync-function", () => {
    it('should send a message when sync is called', () => {
      repository.sync();
      expect(sender.sync).toHaveBeenCalledTimes(1);
    });

    it("Should wait until the server responds with a sync message", (done) => {
      const trigger = new Subject<"before" | "after">();

      const sub = combineLatest(repository.sync(), trigger)
        .subscribe(([entries, state]) => {
          expect(state).toBe("after", "since the server must respond before we receive the entries");
          expect(entries.length).toBe(1, "since we only received one user");
          done();
        });

      _autoUnsub(sub);

      trigger.next("before");
      trigger.next("after");
      $sendSync.next([{ ...userWouter, ...{ uuid: "user-01" } }]);
    });

    it("Check if sync updates the entries", (done) => {
      const trigger = new Subject<"before" | "after">();

      const sub = combineLatest(repository.entities.pipe(skip(1), take(1)), trigger)
        .subscribe(([entries, state]) => {
          expect(state).toBe("after", "since the server must respond before we react to entries");
          expect(entries.length).toBe(1, "since we only received one user");
          done();
        });

      _autoUnsub(sub);

      repository.sync();

      trigger.next("before");
      trigger.next("after");
      $sendSync.next([{ ...userWouter, ...{ uuid: "user-01" } }]);
    });
  });

  describe("use of receive messenger", () => {
    it("should invoke onAdd and register a subscriber", () => {
      expect(receiver.onAdd).toHaveBeenCalledTimes(1);
      expect($receiveAdd.observers.length).toBe(1);
    });

    it("should invoke onUpdate and register a subscriber", () => {
      expect(receiver.onUpdate).toHaveBeenCalledTimes(1);
      expect($receiveUpdate.observers.length).toBe(1);
    });

    it("should invoke onRemove and register a subscriber", () => {
      expect(receiver.onRemove).toHaveBeenCalledTimes(1);
      expect($receiveRemove.observers.length).toBe(1);
    });

    it("should add an entity when the messenger says so", (done) => {
      _autoUnsub(repository.entities.pipe(skip(1)).subscribe(entities => {
        expect(entities.length).toBe(1, "since the server has send a message that we need to add an entity");
        done();
      }));

      $receiveAdd.next({
        data: { ...userWouter, ...{ uuid: "user-01" } }
      });
    });

    it("should remove an entity when the messenger says so", (done) => {
      withUserInRepository(userWouter, () => {
        _autoUnsub(repository.entities.pipe(skip(1)).subscribe(entities => {
          expect(entities.length).toBe(0, "since the server has send a message that we need to remove an entity");
          done();
        }));

        $receiveRemove.next({ uuid: "user-01" });
      })
    });

    it("should update an entity when the messenger says so", (done) => {
      withUserInRepository(userWouter, () => {

        _autoUnsub(repository.entities.pipe(skip(1)).subscribe(entities => {
          expect(entities.length).toBe(1, "since we updated an entity");
          expect(entities[0].name).toBe("Rutger", "since we update the name");
          done();
        }));

        $receiveUpdate.next({
          data: { uuid: "user-01", name: "Rutger" }
        });
      });
    });

    it("should thrown an error when an external update can not be applied due to missing content", (done) => {
      withUserInRepository(userWouter, () => {
        $receiveUpdate.next({
          data: { uuid: "invalid-uuid", name: "Rutger" }
        });

        _autoUnsub(repository.entities
          .subscribe(entities => {
            expect(entities[0].name).toBe("Wouter", "since the invalid uuid has not resulted in a update");
            done();
          }));
      });
    });

    it("should not alter repository when invalid remove is provided", (done) => {
      withUserInRepository(userWouter, () => {
        $receiveRemove.next({
          uuid: "invalid-uuid"
        });

        _autoUnsub(repository.entities
          .subscribe(entities => {
            expect(entities.length).toBe(1, "since the invalid uuid has not resulted in a remove");
            done();
          }));
      });
    });
  });
});

