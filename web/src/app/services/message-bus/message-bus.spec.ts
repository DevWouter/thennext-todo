import { MessageBusInterface, MessageBus } from "./message-bus";
import { Entity } from "../../models/entity";

class FakeUser implements Entity {
  uuid: string;
  name: string;
}

describe('MessageBus', () => {
  let messageBus: MessageBusInterface;

  beforeEach(() => {
    messageBus = new MessageBus();
  });

  it("should exist", () => {
    expect(messageBus).toBeDefined();
  });

  it("should create message-sender", () => {
    const sender = messageBus.createSender<FakeUser>("fake", undefined);
    expect(sender).toBeDefined();
  });

  it("should create message-receiver", () => {
    const receiver = messageBus.createReceiver<FakeUser>("fake", undefined);
    expect(receiver).toBeDefined();
  });

  it("should share WebSockets internally", () => {
    const sender = messageBus.createSender<FakeUser>("fake", undefined);
    const receiver = messageBus.createReceiver<FakeUser>("fake", undefined);

    expect(sender['connection']).toBeDefined();
    expect(receiver['connection']).toBeDefined();
    expect(sender['connection']).toBe(receiver['connection']);
  });
});
