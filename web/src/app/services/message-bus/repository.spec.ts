import { Repository } from "./repository";
import { Entity } from "../../models/entity";
import { Subscription, Subject, combineLatest } from "rxjs";
import { filter, skip, take } from "rxjs/operators";
import { EntityMessengerInterface } from "./entity-messenger";

interface UserFake extends Entity {
  name: string;
}

describe('Repository', () => {
  let userWouter: UserFake;
  let repository: Repository<UserFake>;
  let messenger: jasmine.SpyObj<EntityMessengerInterface<UserFake>>;
  let postActions: (() => Promise<void>)[];
  let $messengerAdd: Subject<UserFake>;
  let $messengerUpdate: Subject<UserFake>;
  let $messengerRemove: Subject<void>;

  function _autoUnsub(sub: Subscription) {
    postActions.push(async () => { sub.unsubscribe(); });
  }

  beforeEach(() => {
    postActions = [];
    userWouter = <UserFake>{ name: "Wouter" };

    $messengerAdd = new Subject<UserFake>();
    $messengerUpdate = new Subject<UserFake>();
    $messengerRemove = new Subject<void>();


    messenger = jasmine.createSpyObj<EntityMessengerInterface<UserFake>>("EntityMessenger", [
      "add",
      "update",
      "remove",
      "sync"]);

    messenger.add.and.returnValue($messengerAdd);
    messenger.update.and.returnValue($messengerUpdate);
    messenger.remove.and.returnValue($messengerRemove);


    repository = new Repository<UserFake>(messenger);
  });

  afterEach((done) => {
    const allPromise = Promise.all(postActions);
    allPromise
      .then(() => { done(); })
      .catch(reasons => { throw reasons; });
  });

  it('should exist', () => {
    expect(repository).toBeTruthy();
  });

  it('should send a message when adding entity', () => {
    repository.add(userWouter);
    const messengerArgs = messenger.add.calls.mostRecent().args;
    expect(messengerArgs[0]).toBe(userWouter, "first argument should be the entity");
  });

  it('should send a message when updating entity', (done) => {
    const sub = repository.add(userWouter).subscribe(() => {
      repository.update(userWouter);
      const messengerArgs = messenger.update.calls.mostRecent().args;
      expect(messengerArgs[0]).toBe(userWouter, "first argument should be the entity");
      done();
    });

    _autoUnsub(sub);

    $messengerAdd.next({ ...userWouter, ... { uuid: "user-01" } });
  });

  it('should send a message when removing entity', (done) => {
    _autoUnsub(repository.add(userWouter).subscribe(() => {
      repository.remove(userWouter);
      const messengerArgs = messenger.remove.calls.mostRecent().args;
      expect(messengerArgs[0]).toBe(userWouter, "first argument should be the entity");
      done();
    }));

    $messengerAdd.next({ ...userWouter, ... { uuid: "user-01" } });
  });

  it('should send a message when sync is called', () => {
    repository.sync();
    expect(messenger.sync).toHaveBeenCalledTimes(1);
  });

  it('The add function returns an observable that will resolve when server replies', (done) => {
    let obs = repository.add(userWouter);
    const sub = obs.subscribe((entity) => {
      expect(entity).toBeDefined();
      expect(entity).toBe(userWouter, "since we expect the original object to be returned and not ths server value");
      expect(entity.uuid).toBe("user-01", "because the server should provide an UUID");
    });

    _autoUnsub(sub);
    _autoUnsub(obs.subscribe(() => done()));

    $messengerAdd.next({ ...userWouter, ... { uuid: "user-01" } });
  });

  it('The update function returns an observable that will resolve when server replies', (done) => {
    _autoUnsub(repository.add(userWouter).subscribe(() => {
      let obs = repository.update(userWouter);
      const sub = obs.subscribe((entity) => {
        expect(entity).toBeDefined();
        expect(entity).toBe(userWouter, "since we expect the original object to be returned and not ths server value");
        done();
      });
      _autoUnsub(sub);
      $messengerUpdate.next({ ...userWouter });
    }));

    $messengerAdd.next({ ...userWouter, ... { uuid: "user-01" } });
  });

  it('The remove function returns an observable that will resolve when server replies', (done) => {
    _autoUnsub(repository.add(userWouter).subscribe(() => {
      let obs = repository.remove(userWouter);
      const sub = obs.subscribe((entity) => {
        expect(entity).toBeUndefined("since we expect the remove function to actually remove the entity");
      });

      _autoUnsub(sub);
      _autoUnsub(obs.subscribe(() => done()));

      $messengerRemove.next();
    }));

    $messengerAdd.next({ ...userWouter, ... { uuid: "user-01" } });
  });

  it("should have an empty entries list on start", (done) => {
    repository.entries.subscribe(entries => {
      expect(entries.length).toBe(0);
      done();
    })
  });

  it("should *not* add an entity to the local repository *before* the server responds", (done) => {
    const trigger = new Subject<"before" | "after">();
    const sub = combineLatest(repository.entries, trigger.pipe(filter(x => x === "before")))
      .subscribe(([entries, state]) => {
        expect(entries.length).toBe(0, "since the server has yet to respond there should be no entries");
        done();
      });

    _autoUnsub(sub);

    // Simply add it.
    repository.add(userWouter);
    trigger.next("before");
  });

  it("should add an entity to the local repository *after* the server responds", (done) => {
    const trigger = new Subject<"before" | "after">();

    const sub = combineLatest(repository.entries, trigger.pipe(filter(x => x === "after")))
      .subscribe(([entries, state]) => {
        expect(entries[0]).toBe(userWouter, "since the server has responded there should be 1 entry");
        done();
      });

    _autoUnsub(sub);

    repository.add(userWouter);

    trigger.next("before");
    $messengerAdd.next({ ...userWouter, ... { uuid: "user-01" } });
    trigger.next("after");
  });

  // Unlike `add` and `remove` then `update` function will result in an instant update.
  // This is because the user might be typing (which results in multiple updates) and
  // as such all updates are send through.
  it("should update the entities observable before the server responds with an update", (done) => {
    _autoUnsub(repository.add(userWouter).subscribe(() => {
      const trigger = new Subject<"before" | "after">();
      const sub = combineLatest(repository.entries.pipe(skip(1), take(1)), trigger.pipe(filter(x => x === "before")))
        .subscribe(() => {
          expect().nothing();
          done();
        });

      _autoUnsub(sub);

      repository.update(userWouter);
      trigger.next("before");
    }));

    $messengerAdd.next({ ...userWouter, ... { uuid: "user-01" } });
  });

  it("should update the entities observable when the server responds with an remove", (done) => {

    _autoUnsub(repository.add(userWouter).subscribe(() => {
      const trigger = new Subject<"before" | "after">();

      const sub = combineLatest(repository.entries.pipe(skip(1), take(1)), trigger)
        .subscribe(([entries, state]) => {
          expect(state).toBe("after", "since the server must respond before we react to entries");
          done();
        });

      _autoUnsub(sub);

      repository.remove(userWouter);

      trigger.next("before");
      trigger.next("after");
      $messengerRemove.next();
    }));

    $messengerAdd.next({ ...userWouter, ... { uuid: "user-01" } });
  });

  it("should thrown an error when adding an entity that has an uuid to the repository", () => {
    userWouter.uuid = "not-allowed"
    const call = () => { repository.add(userWouter); };
    expect(call).toThrowError("The entity has an uuid, which is not allowed when adding");
  });

  it("should thrown an error when updating an entity that is missing an uuid to the repository", () => {
    userWouter.uuid = undefined;
    const call = () => { repository.update(userWouter); }
    expect(call).toThrowError("The entity is missing an uuid");
  });

  it("should thrown an error when removing an entity that is missing an uuid from the repository", () => {
    userWouter.uuid = undefined;
    const call = () => { repository.remove(userWouter); }
    expect(call).toThrowError("The entity is missing an uuid");
  });

  it("should thrown an error when updating an entity whose uuid is unknown the repository", () => {
    userWouter.uuid = "unknown-uuid";
    const call = () => { repository.update(userWouter); }
    expect(call).toThrowError("The entity is unknown in storage");
  });

  it("should thrown an error when removing an entity whose uuid is unknown to the repository", () => {
    userWouter.uuid = "unknown-uuid";
    const call = () => { repository.remove(userWouter); }
    expect(call).toThrowError("The entity is unknown in storage");
  });

  // TODO: external Add
  // TODO: external Update
  // TODO: external Remove

  // TODO: Check the observable from sync message
  // TODO: Check if sync updates the entries
});
