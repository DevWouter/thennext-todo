import { EntityMessageReceiver } from "./entity-message-receiver";
import { WsConnectionInterface } from "./ws-connection";
import { WsEventBasic, WsEvent } from "../ws/events";
import { Subject, Subscription } from "rxjs";

interface FakeUser {
  uuid: string;
  name: string;
}

describe("EntityMessageReceiver", () => {
  let receiver: EntityMessageReceiver<FakeUser>;
  let connection: jasmine.SpyObj<WsConnectionInterface>;
  let $events: Subject<WsEventBasic>;
  let postActions: (() => Promise<void>)[];
  let userWouter: FakeUser;
  let entityType: string;
  let reviverFunc: jasmine.Spy;

  function _autoUnsub(sub: Subscription) {
    postActions.push(async () => { sub.unsubscribe(); });
  }

  beforeEach(() => {
    postActions = [];
    entityType = "UserEntity";
    userWouter = { name: "Wouter", uuid: "user-01" };

    $events = new Subject<WsEventBasic>();

    connection = jasmine.createSpyObj<WsConnectionInterface>("connection", ["events"]);
    reviverFunc = jasmine.createSpy("reviver", (key: any, value: any): any => value);
    connection.events.and.returnValue($events);


    receiver = new EntityMessageReceiver(connection, entityType, reviverFunc);
  });

  afterEach((done) => {
    const allPromise = Promise.all(postActions);
    allPromise
      .then(() => { done(); })
      .catch(reasons => { throw reasons; });
  });

  it("should exists", () => {
    expect(receiver).toBeDefined();
  });

  it("should listen to 'user-entity' messages for `onAdd` that are from remote client", (done) => {
    _autoUnsub(receiver.onAdd().subscribe(x => {
      expect(x.data).toBe(userWouter);
      done();
    }));

    $events.next(<WsEvent<"entity-created">>{
      type: "entity-created",
      echo: false,
      refId: "ref-id",
      data: { entityKind: entityType, entity: userWouter }
    });
  });

  it("should listen to 'user-entity' messages for `onUpdate` that are from remote client", (done) => {
    _autoUnsub(receiver.onUpdate().subscribe(x => {
      expect(x.data).toBe(userWouter);
      done();
    }));

    $events.next(<WsEvent<"entity-updated">>{
      type: "entity-updated",
      echo: false,
      refId: "ref-id",
      data: { entityKind: entityType, entity: userWouter }
    });
  });

  it("should listen to 'user-entity' messages for `onRemove` that are from remote client", (done) => {
    _autoUnsub(receiver.onRemove().subscribe(x => {
      expect(x.uuid).toBe(userWouter.uuid);
      done();
    }));

    $events.next(<WsEvent<"entity-deleted">>{
      type: "entity-deleted",
      echo: false,
      refId: "ref-id",
      data: { entityKind: entityType, uuid: userWouter.uuid }
    });
  });

  it("should ignore 'user-entity' messages for `onAdd` that are from local client", (done) => {
    let messagesReceived = 0;
    _autoUnsub(receiver.onAdd().subscribe({
      next() { messagesReceived++; },
      complete() {
        expect(messagesReceived).toBe(0, "since echoed messages are ignored");
        done();
      }
    }));

    $events.next(<WsEvent<"entity-created">>{
      type: "entity-created",
      echo: true,
      refId: "ref-id",
      data: { entityKind: entityType, entity: userWouter }
    });

    $events.complete();
  });

  it("should ignore to 'user-entity' messages for `onUpdate` that are from local client", (done) => {
    let messagesReceived = 0;
    _autoUnsub(receiver.onUpdate().subscribe({
      next() { messagesReceived++; },
      complete() {
        expect(messagesReceived).toBe(0, "since echoed messages are ignored");
        done();
      }
    }));

    $events.next(<WsEvent<"entity-updated">>{
      type: "entity-updated",
      echo: true,
      refId: "ref-id",
      data: { entityKind: entityType, entity: userWouter }
    });

    $events.complete();

  });

  it("should ignore to 'user-entity' messages for `onRemove` that are from local client", (done) => {
    let messagesReceived = 0;
    _autoUnsub(receiver.onAdd().subscribe({
      next() { messagesReceived++; },
      complete() {
        expect(messagesReceived).toBe(0, "since echoed messages are ignored");
        done();
      }
    }));

    $events.next(<WsEvent<"entity-deleted">>{
      type: "entity-deleted",
      echo: true,
      refId: "ref-id",
      data: { entityKind: entityType, uuid: userWouter.uuid }
    });

    $events.complete();
  });

  it("should ignore 'wrong-type' messages for `onAdd` that are from remote client", (done) => {
    let messagesReceived = 0;
    _autoUnsub(receiver.onAdd().subscribe({
      next() { messagesReceived++; },
      complete() {
        expect(messagesReceived).toBe(0, "since echoed messages are ignored");
        done();
      }
    }));

    $events.next(<WsEvent<"entity-created">>{
      type: "entity-created",
      echo: false,
      refId: "ref-id",
      data: { entityKind: "wrong-type", entity: userWouter }
    });

    $events.complete();
  });

  it("should ignore to 'wrong-type' messages for `onUpdate` that are from remote client", (done) => {
    let messagesReceived = 0;
    _autoUnsub(receiver.onUpdate().subscribe({
      next() { messagesReceived++; },
      complete() {
        expect(messagesReceived).toBe(0, "since echoed messages are ignored");
        done();
      }
    }));

    $events.next(<WsEvent<"entity-updated">>{
      type: "entity-updated",
      echo: false,
      refId: "ref-id",
      data: { entityKind: "wrong-type", entity: userWouter }
    });

    $events.complete();

  });

  it("should ignore to 'wrong-type' messages for `onRemove` that are from remote client", (done) => {
    let messagesReceived = 0;
    _autoUnsub(receiver.onAdd().subscribe({
      next() { messagesReceived++; },
      complete() {
        expect(messagesReceived).toBe(0, "since echoed messages are ignored");
        done();
      }
    }));

    $events.next(<WsEvent<"entity-deleted">>{
      type: "entity-deleted",
      echo: false,
      refId: "ref-id",
      data: { entityKind: "wrong-type", uuid: userWouter.uuid }
    });

    $events.complete();
  });

  it("should use the reviver when `onAdd` occurs", (done) => {
    _autoUnsub(receiver.onAdd().subscribe({
      next() { },
      complete() {
        // It shouldn't touch the uuid
        expect(reviverFunc).toHaveBeenCalledTimes(1);
        expect(reviverFunc).toHaveBeenCalledWith("name", "Wouter");
        done();
      }
    }));

    $events.next(<WsEvent<"entity-created">>{
      type: "entity-created",
      echo: false,
      refId: "ref-id",
      data: {
        entityKind: entityType,
        entity: userWouter
      }
    });

    $events.complete();
  });

  it("should use the reviver when `onUpdate` occurs", (done) => {
    _autoUnsub(receiver.onUpdate().subscribe({
      next() { },
      complete() {
        // It shouldn't touch the uuid
        expect(reviverFunc).toHaveBeenCalledTimes(1);
        expect(reviverFunc).toHaveBeenCalledWith("name", "Wouter");
        done();
      }
    }));

    $events.next(<WsEvent<"entity-updated">>{
      type: "entity-updated",
      echo: false,
      refId: "ref-id",
      data: {
        entityKind: entityType,
        entity: userWouter
      }
    });

    $events.complete();
  });

  it("should not fail if the reviver is missing", (done) => {
    receiver = new EntityMessageReceiver(connection, entityType, null);
    _autoUnsub(receiver.onAdd().subscribe({
      next(event) {
        expect(event.data.name).toBe("Wouter");
        expect(event.data.uuid).toBe("user-01");
      },
      complete() {
        done();
      }
    }));

    $events.next(<WsEvent<"entity-created">>{
      type: "entity-created",
      echo: false,
      refId: "ref-id",
      data: {
        entityKind: entityType,
        entity: userWouter
      }
    });

    $events.complete();
  })
});
