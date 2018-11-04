import { Repository } from "./repository";
import { Entity } from "../../models/entity";
import { Observable, Subscription, from, Subject, BehaviorSubject, combineLatest } from "rxjs";
import { map, tap, share, filter } from "rxjs/operators";
import { EntityMessengerInterface } from "./entity-messenger";

interface UserFake extends Entity {
  name: string;
}

const ref_id_1 = "ref-id-1";
const ref_id_2 = "ref-id-2";
const ref_id_3 = "ref-id-3";
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
      "sync",
      "createRefId"]);

    messenger.add.and.returnValue($messengerAdd);
    messenger.update.and.returnValue($messengerUpdate);
    messenger.remove.and.returnValue($messengerRemove);

    messenger.createRefId.and.returnValues(ref_id_1, ref_id_2, ref_id_3);

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
    expect(messengerArgs[0]).toBe(ref_id_1, "first argument should be the generated ref-id");
    expect(messengerArgs[1]).toBe(userWouter, "second argument should be the entity");
  });

  it('should send a message when updating entity', () => {
    repository.update(userWouter);
    const messengerArgs = messenger.update.calls.mostRecent().args;
    expect(messengerArgs[0]).toBe(ref_id_1, "first argument should be the generated ref-id");
    expect(messengerArgs[1]).toBe(userWouter, "second argument should be the entity");
  });

  it('should send a message when removing entity', () => {
    repository.remove(userWouter);
    const messengerArgs = messenger.remove.calls.mostRecent().args;
    expect(messengerArgs[0]).toBe(ref_id_1, "first argument should be the generated ref-id");
    expect(messengerArgs[1]).toBe(userWouter, "second argument should be the entity");
  });

  it('should send a message when sync is called', () => {
    repository.sync();
    const messengerArgs = messenger.sync.calls.mostRecent().args;
    expect(messengerArgs[0]).toBe(ref_id_1, "first argument should be the generated ref-id");
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
    let obs = repository.update(userWouter);
    const sub = obs.subscribe((entity) => {
      expect(entity).toBeDefined();
      expect(entity).toBe(userWouter, "since we expect the original object to be returned and not ths server value");
    });

    _autoUnsub(sub);
    _autoUnsub(obs.subscribe(() => done()));

    $messengerUpdate.next({ ...userWouter });
  });

  it('The remove function returns an observable that will resolve when server replies', (done) => {
    let obs = repository.remove(userWouter);
    const sub = obs.subscribe((entity) => {
      expect(entity).toBeUndefined("since we expect the remove function to actually remove the entity");
    });

    _autoUnsub(sub);
    _autoUnsub(obs.subscribe(() => done()));

    $messengerRemove.next();
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

  // TODO: Self Update
  // TODO: Self Remove
  // TODO: Add should check for uuid already in use
  // TODO: Update should check if uuid is available
  // TODO: Update should check if uuid is known
  // TODO: Remove should check if uuid is available

  // TODO: external Add
  // TODO: external Update
  // TODO: external Remove

  // TODO: Check the observable from sync message
  // TODO: Check if sync updates the entries
});
