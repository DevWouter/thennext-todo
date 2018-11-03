import { Repository } from "./repository";
import { Entity } from "../../models/entity";
import { Observable, Subscription } from "rxjs";
import { EntityMessengerInterface } from "./entity-messenger";

interface UserFake extends Entity {
  name: string;
}

describe('Repository', () => {
  let userWouter: UserFake;
  let repository: Repository<UserFake>;
  let messenger: jasmine.SpyObj<EntityMessengerInterface<UserFake>>;
  let postActions: (() => Promise<void>)[];

  beforeEach(() => {
    postActions = [];
    userWouter = <UserFake>{ name: "Wouter" };

    messenger = jasmine.createSpyObj<EntityMessengerInterface<UserFake>>("EntityMessenger", [
      "add",
      "update",
      "remove",
      "sync",
      "createRefId"]);
    messenger.createRefId.and.returnValues("ref-id-1", "ref-id-2", "ref-id-3");
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

  it('should have an observable array of entities', () => {
    expect(repository.entities).toEqual(jasmine.any(Observable));
  });

  it('should initially be empty', (done) => {
    const sub = repository.entities.subscribe(entities => {
      expect(entities).toBeDefined("when not initialized it should still return an empty array");
      expect(entities.length).toBe(0, "when not initialized it should still return an empty array");
      done();
    });

    postActions.push(async () => { sub.unsubscribe() });
  });

  it('should send a message when adding entity', () => {
    repository.add(userWouter);
    const messengerArgs = messenger.add.calls.mostRecent().args;
    expect(messengerArgs[0]).toBe("ref-id-1", "first argument should be the generated ref-id");
    expect(messengerArgs[1]).toBe(userWouter, "second argument should be the entity");
  });

  it('should send a message when updating entity', () => {
    repository.update(userWouter);
    const messengerArgs = messenger.update.calls.mostRecent().args;
    expect(messengerArgs[0]).toBe("ref-id-1", "first argument should be the generated ref-id");
    expect(messengerArgs[1]).toBe(userWouter, "second argument should be the entity");
  });

  it('should send a message when removing entity', () => {
    repository.remove(userWouter);
    const messengerArgs = messenger.remove.calls.mostRecent().args;
    expect(messengerArgs[0]).toBe("ref-id-1", "first argument should be the generated ref-id");
    expect(messengerArgs[1]).toBe(userWouter, "second argument should be the entity");
  });

  it('should send a message when sync is called', () => {
    repository.sync();
    const messengerArgs = messenger.sync.calls.mostRecent().args;
    expect(messengerArgs[0]).toBe("ref-id-1", "first argument should be the generated ref-id");
  });
});
