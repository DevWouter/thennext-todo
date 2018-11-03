import { EntityMessenger } from "./entity-messenger";
import { MessageBusInterface } from "./message-bus.service";
import { WsCommandMap } from "../ws/commands";
import { Subject, BehaviorSubject } from "rxjs";
import { MessageBusState, MessageBusStateConnection } from "./message-bus-state";
import { Entity } from "../../models/entity";
import { filter, map } from "rxjs/operators";
import { WsEventMap, WsEvent } from "../ws/events";
import { EntityEventCallbacks } from "./entity-event-callbacks";
import { type } from "os";

interface BaseMessage {
  type: keyof WsCommandMap;
}
interface Message<K extends keyof WsCommandMap> extends BaseMessage {
  type: K;
  data: WsCommandMap[K];
}

interface FakeEntity extends Entity {
  uuid: string;
}

class FakeMessageBus implements MessageBusInterface {

  private _state = {
    connection: {
      activated: false,
      authenticated: false,
      connected: false,
      error: null,
    }
  };

  private $send = new Subject<BaseMessage>();

  state = new BehaviorSubject<MessageBusState>(this._state);
  handlers: { type: keyof WsEventMap, handler: (data: any) => void }[] = [];
  public messages: BaseMessage[] = [];

  send<K extends keyof WsCommandMap>(type: K, data: WsCommandMap[K]): void {
    const message = <BaseMessage>{ type: (type as string), data: data };
    this.messages.push(message);
    this.$send.next(message);
  }

  simulateReceive<K extends keyof WsEventMap>(type: K, data: WsEvent<K>): void {
    this.handlers
      .filter(x => x.type === type)
      .forEach(x => x.handler(data));
  }

  addSendEventHandler<K extends keyof WsCommandMap>(type: K, listener: (data: WsCommandMap[K]) => void): void {
    this.$send.pipe(
      filter(x => x.type === type),
      map(x => x as Message<K>)
    ).subscribe(x => listener(x.data));
  }

  addEventHandler<K extends keyof WsEventMap>(type: K, listener: (data: WsEvent<K>) => void): void {
    this.handlers.push({ type: type, handler: listener });
  }

  setState(newState: Partial<MessageBusStateConnection>) {
    this._state = {
      connection: { ...this._state.connection, ...newState }
    };

    this.state.next(this._state);
  }
}

describe("Entity Messenger", () => {
  const ENTITY_TYPE = "FakeEntity";
  let messenger: EntityMessenger<FakeEntity>;
  let messageBus: FakeMessageBus;
  let callbacks: jasmine.SpyObj<EntityEventCallbacks<FakeEntity>>;
  beforeEach(() => {
    callbacks = jasmine.createSpyObj<EntityEventCallbacks<FakeEntity>>(
      "callbacks",
      ["onEntitiesSynced", "onEntityCreated", "onEntityDeleted", "onEntityUpdated"]
    );

    messageBus = new FakeMessageBus();
    messenger = new EntityMessenger<FakeEntity>(ENTITY_TYPE, messageBus);
    messenger.setup(callbacks);
  });

  it("should exist", () => {
    expect(messenger).toBeDefined();
  });

  it("should throw when setup is called for the second time", () => {
    // NOTE: We already invoke setup in `beforeEach`
    expect(() => messenger.setup(null)).toThrowError("EntityMessenger.setup can only be called once");
  })

  it("should request all entities when messagebus is authenticated", (done) => {
    messageBus.addSendEventHandler("sync-entities", (data) => {
      expect(data.entityKind).toBe(ENTITY_TYPE);
      done();
    });

    messageBus.setState({
      authenticated: true,
    });
  });

  it("should re-request all entities on connect/disconnect", (done) => {
    let callCounter = 0;

    messageBus.addSendEventHandler("sync-entities", (data) => {
      callCounter++;

      if (callCounter === 2) {
        expect(callCounter).toBe(2);
        done();
      }
    });

    // The initial
    messageBus.setState({ authenticated: true });
    messageBus.setState({ authenticated: false }); // Disconnect
    messageBus.setState({ authenticated: true }); // Reconnect
  });

  it(`should register it's own entity-created`, () => {
    expect(messageBus.handlers.filter(x => x.type === "entity-created").length).toBe(1);
  });

  it(`should register it's own entity-updated`, () => {
    expect(messageBus.handlers.filter(x => x.type === "entity-updated").length).toBe(1);
  });

  it(`should register it's own entity-deleted`, () => {
    expect(messageBus.handlers.filter(x => x.type === "entity-deleted").length).toBe(1);
  });

  it(`should register it's own entities-synced`, () => {
    expect(messageBus.handlers.filter(x => x.type === "entities-synced").length).toBe(1);
  });

  it(`should invoke the onEntityAdded callback when entity-created is called`, () => {
    let entity: FakeEntity = {
      uuid: "abcdef",
    };

    messageBus.simulateReceive("entity-created", {
      data: { entityKind: ENTITY_TYPE, entity: entity },
      echo: false,
      type: "entity-created"
    });

    expect(callbacks.onEntityCreated).toHaveBeenCalledTimes(1);
    expect(callbacks.onEntityUpdated).toHaveBeenCalledTimes(0);
    expect(callbacks.onEntityDeleted).toHaveBeenCalledTimes(0);
    expect(callbacks.onEntitiesSynced).toHaveBeenCalledTimes(0);
  });
  it(`should invoke the onEntityUpdated callback when entity-updated is called`, () => {
    let entity: FakeEntity = {
      uuid: "abcdef",
    };

    messageBus.simulateReceive("entity-updated", {
      data: { entityKind: ENTITY_TYPE, entity: entity },
      echo: false,
      type: "entity-updated"
    });

    expect(callbacks.onEntityCreated).toHaveBeenCalledTimes(0);
    expect(callbacks.onEntityUpdated).toHaveBeenCalledTimes(1);
    expect(callbacks.onEntityDeleted).toHaveBeenCalledTimes(0);
    expect(callbacks.onEntitiesSynced).toHaveBeenCalledTimes(0);
  });

  it(`should invoke the onEntityDeleted callback when entity-deleted is called`, () => {
    let entity: FakeEntity = {
      uuid: "abcdef",
    };

    messageBus.simulateReceive("entity-deleted", {
      data: { entityKind: ENTITY_TYPE, uuid: entity.uuid },
      echo: false,
      type: "entity-deleted"
    });


    expect(callbacks.onEntityCreated).toHaveBeenCalledTimes(0);
    expect(callbacks.onEntityUpdated).toHaveBeenCalledTimes(0);
    expect(callbacks.onEntityDeleted).toHaveBeenCalledTimes(1);
    expect(callbacks.onEntitiesSynced).toHaveBeenCalledTimes(0);
  });

  it(`should invoke the onEntitySynced callback when entities-synced is called`, () => {
    let entity: FakeEntity = {
      uuid: "abcdef",
    };

    messageBus.simulateReceive("entities-synced", {
      data: { entityKind: ENTITY_TYPE, entities: [entity] },
      echo: false,
      type: "entities-synced"
    });

    expect(callbacks.onEntityCreated).toHaveBeenCalledTimes(0);
    expect(callbacks.onEntityUpdated).toHaveBeenCalledTimes(0);
    expect(callbacks.onEntityDeleted).toHaveBeenCalledTimes(0);
    expect(callbacks.onEntitiesSynced).toHaveBeenCalledTimes(1);
  });

  it("should return the refId it uses for sending when calling sendCreate", () => {
    const entity: FakeEntity = {
      uuid: "abcdef",
    };

    const returnedRefId = messenger.sendCreate(entity);
    const message = messageBus.messages[0];
    if (message.type === "create-entity") {
      let typedMessage = message as Message<"create-entity">;
      expect(typedMessage.data.refId).toBe(returnedRefId);
      expect(typedMessage.data.entity).toBe(entity);
      expect(typedMessage.data.entityKind).toBe(ENTITY_TYPE);
    }
  })
});
