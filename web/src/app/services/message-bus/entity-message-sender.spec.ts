import { Subject, Subscription } from "rxjs";
import { EntityMessageSender } from "./entity-message-sender";
import { Entity } from "../../models/entity";
import { WsConnectionFactoryInterface } from "./ws-connection-factory";
import { WsConnectionInterface } from "./ws-connection";
import { EntityRefIdGenerator } from "./entity-refid-generator";

import {
  WsEventBasic,
  WsEvent,
  EntityCreatedEvent
} from "../ws/events";

import {
  WsCommandMap,
  CreateEntityCommand,
  UpdateEntityCommand,
  DeleteEntityCommand,
  EntityCommand,
} from "../ws/commands";


class FakeUser implements Entity {
  uuid: string;
  name: string;
}

describe("EntityMessengerSender", () => {
  let sender: EntityMessageSender<FakeUser>;
  let connectionFactory: jasmine.SpyObj<WsConnectionFactoryInterface>;
  let connection: jasmine.SpyObj<WsConnectionInterface>;
  let refIdGenerator: jasmine.SpyObj<EntityRefIdGenerator>;
  let $events: Subject<WsEventBasic>;
  let postActions: (() => Promise<void>)[];
  let userWouter: FakeUser;
  let userRutger: FakeUser;
  let entityType: string;
  let reviverFunc: jasmine.Spy;

  function _autoUnsub(sub: Subscription) {
    postActions.push(async () => { sub.unsubscribe(); });
  }

  beforeEach(() => {
    postActions = [];
    entityType = "UserEntity";
    userWouter = { name: "Wouter", uuid: "user-01" };
    userRutger = { name: "Rutger", uuid: "user-01" };

    $events = new Subject<WsEventBasic>();
    reviverFunc = jasmine.createSpy("reviver", (key: any, value: any): any => value);

    refIdGenerator = jasmine.createSpyObj<EntityRefIdGenerator>("refIdGenerator", ["next"]);
    refIdGenerator.next.and.returnValues("msg-1", "msg-2", "msg-3", "msg-4");

    connection = jasmine.createSpyObj<WsConnectionInterface>("connection", ["events", "send"]);
    connection.events.and.returnValue($events);

    connectionFactory = jasmine.createSpyObj<WsConnectionFactoryInterface>("connectionFactory", ["create", "createRefId"]);
    connectionFactory.create.and.returnValue(connection);
    connectionFactory.createRefId.and.returnValue(refIdGenerator);

    sender = new EntityMessageSender<FakeUser>(connectionFactory, entityType, reviverFunc);
  });

  afterEach((done) => {
    const allPromise = Promise.all(postActions);
    allPromise
      .then(() => { done(); })
      .catch(reasons => { throw reasons; });
  });

  it("should exist", () => {
    expect(sender).toBeDefined();
  });

  it("should request an refIdGenerator with entity type as tag", () => {
    expect(connectionFactory.createRefId).toHaveBeenCalledWith(entityType);
  });

  it("should send a add-message when `add` is called", () => {
    sender.add(userWouter);

    expect(connection.send).toHaveBeenCalledTimes(1);
    const cmdType = connection.send.calls.mostRecent().args[0] as keyof WsCommandMap;
    const command = connection.send.calls.mostRecent().args[1] as CreateEntityCommand;
    expect(cmdType).toBe("create-entity");
    expect(command.entityKind).toBe(entityType);
    expect(command.entity).toBe(userWouter);
    expect(command.refId).toBeDefined();
  });

  it("should send a update-message when `update` is called", () => {
    sender.update(userWouter);

    expect(connection.send).toHaveBeenCalledTimes(1);
    const cmdType = connection.send.calls.mostRecent().args[0] as keyof WsCommandMap;
    const command = connection.send.calls.mostRecent().args[1] as UpdateEntityCommand;
    expect(cmdType).toBe("update-entity");
    expect(command.entityKind).toBe(entityType);
    expect(command.entity).toBe(userWouter);
    expect(command.refId).toBeDefined();
  });

  it("should send a delete-message when `remove` is called", () => {
    sender.remove(userWouter);

    expect(connection.send).toHaveBeenCalledTimes(1);
    const cmdType = connection.send.calls.mostRecent().args[0] as keyof WsCommandMap;
    const command = connection.send.calls.mostRecent().args[1] as DeleteEntityCommand;
    expect(cmdType).toBe("delete-entity");
    expect(command.entityKind).toBe(entityType);
    expect(command.uuid).toBe(userWouter.uuid);
    expect(command.refId).toBeDefined();
  });

  it("should send a sync-message when `sync` is called", () => {
    sender.sync();

    expect(connection.send).toHaveBeenCalledTimes(1);
    const cmdType = connection.send.calls.mostRecent().args[0] as keyof WsCommandMap;
    const command = connection.send.calls.mostRecent().args[1] as EntityCommand;
    expect(cmdType).toBe("sync-entities");
    expect(command.entityKind).toBe(entityType);
    expect(command.refId).toBeDefined();
  });

  it("should complete the observable of the `add`-function when the server responds with a message", (done) => {
    const obs = sender.add(userWouter);
    obs.subscribe({
      complete() { done(); },
      next(remote) { expect(remote.uuid).toBe(userWouter.uuid); }
    });

    $events.next(<WsEvent<"entity-created">>{
      echo: true,
      data: {
        entity: JSON.parse(JSON.stringify(userWouter)),
        entityKind: entityType
      },
      refId: "msg-1",
      type: "entity-created"
    });
  });

  it("should complete the observable of the `update`-function when the server responds with a message", (done) => {
    const obs = sender.update(userWouter);
    obs.subscribe({
      complete() { done(); },
      next(remote) { expect(remote.uuid).toBe(userWouter.uuid); }
    });

    $events.next(<WsEvent<"entity-updated">>{
      echo: true,
      data: {
        entity: JSON.parse(JSON.stringify(userWouter)),
        entityKind: entityType
      },
      refId: "msg-1",
      type: "entity-updated"
    });
  });

  it("should complete the observable of the `remove`-function when the server responds with a message", (done) => {
    const obs = sender.remove(userWouter);
    obs.subscribe(() => {
      expect().nothing();
      done();
    });

    $events.next(<WsEvent<"entity-deleted">>{
      echo: true,
      data: {
        uuid: userWouter.uuid,
        entityKind: entityType
      },
      refId: "msg-1",
      type: "entity-deleted"
    });
  });

  it("should complete the observable of the `sync`-function when the server responds with a message", (done) => {
    const obs = sender.sync();
    obs.subscribe((entities) => {
      expect(entities.length).toBe(2);
      done();
    });

    $events.next(<WsEvent<"entities-synced">>{
      echo: true,
      data: {
        entities: JSON.parse(JSON.stringify([userWouter, userRutger])),
        entityKind: entityType
      },
      refId: "msg-1",
      type: "entities-synced"
    });
  });

  it("should use the reviver for results retrieved through `add`-function", (done) => {
    reviverFunc.and.callFake(() => "replaced");
    const obs = sender.add(userWouter);
    obs.subscribe({
      complete() { done(); },
      next(remote) {
        expect(remote.uuid).toBe(userWouter.uuid, "since the reviver shouldn't touch that");
        expect(remote.name).toBe("replaced", "since the reviver replaces all values");
        expect(reviverFunc).toHaveBeenCalledTimes(1);
      }
    });

    $events.next(<WsEvent<"entity-created">>{
      echo: true,
      data: {
        entity: JSON.parse(JSON.stringify(userWouter)),
        entityKind: entityType
      },
      refId: "msg-1",
      type: "entity-created"
    });
  });

  it("should use the reviver for results retrieved through `update`-function", (done) => {
    reviverFunc.and.callFake(() => "replaced");
    const obs = sender.update(userWouter);
    obs.subscribe({
      complete() { done(); },
      next(remote) {
        expect(remote.uuid).toBe(userWouter.uuid, "since the reviver shouldn't touch that");
        expect(remote.name).toBe("replaced", "since the reviver replaces all values");
        expect(reviverFunc).toHaveBeenCalledTimes(1);
      }
    });

    $events.next(<WsEvent<"entity-updated">>{
      echo: true,
      data: {
        entity: JSON.parse(JSON.stringify(userWouter)),
        entityKind: entityType
      },
      refId: "msg-1",
      type: "entity-updated"
    });
  });

  it("should use the reviver for results retrieved through `sync`-function", (done) => {
    reviverFunc.and.callFake(() => "replaced");
    const obs = sender.sync();
    obs.subscribe({
      complete() { done(); },
      next(remotes) {
        expect(remotes[0].uuid).toBe(userWouter.uuid, "since the reviver shouldn't touch that");
        expect(remotes[1].uuid).toBe(userRutger.uuid, "since the reviver shouldn't touch that");
        expect(remotes[0].name).toBe("replaced", "since the reviver replaces all values");
        expect(remotes[1].name).toBe("replaced", "since the reviver replaces all values");
        expect(reviverFunc).toHaveBeenCalledTimes(2);
      }
    });

    $events.next(<WsEvent<"entities-synced">>{
      echo: true,
      data: {
        entities: JSON.parse(JSON.stringify([userWouter, userRutger])),
        entityKind: entityType
      },
      refId: "msg-1",
      type: "entities-synced"
    });
  });

  it("should cause an error when the source errors for the add-observable", (done) => {
    const obs = sender.add(userWouter);
    obs.subscribe({
      error(reason) {
        expect(reason).toBe("simulated failure");
        done();
      }
    });

    $events.error("simulated failure");
  });

  it("should cause an error when the source errors for the update-observable", (done) => {
    const obs = sender.update(userWouter);
    obs.subscribe({
      error(reason) {
        expect(reason).toBe("simulated failure");
        done();
      }
    });

    $events.error("simulated failure");
  });

  it("should cause an error when the source errors for the remove-observable", (done) => {
    const obs = sender.remove(userWouter);
    obs.subscribe({
      error(reason) {
        expect(reason).toBe("simulated failure");
        done();
      }
    });

    $events.error("simulated failure");
  });

  it("should cause an error when the source errors for the sync-observable", (done) => {
    const obs = sender.sync();
    obs.subscribe({
      error(reason) {
        expect(reason).toBe("simulated failure");
        done();
      }
    });

    $events.error("simulated failure");
  });

  it("should not fail if the reviver is missing", (done) => {
    sender = new EntityMessageSender(connectionFactory, entityType, null);
    _autoUnsub(sender.add(userWouter).subscribe({
      next(remoteEntity) {
        expect(remoteEntity.name).toBe("Wouter");
        expect(remoteEntity.uuid).toBe("user-01");
      },
      complete() {
        done();
      }
    }));

    $events.next(<WsEvent<"entity-created">>{
      type: "entity-created",
      echo: true,
      refId: "msg-1",
      data: {
        entityKind: entityType,
        entity: userWouter
      }
    });

    $events.complete();
  })
});
