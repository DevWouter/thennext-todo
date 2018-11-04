import { EntityMessageSender } from "./entity-message-sender";
import { Entity } from "../../models/entity";

class FakeUser implements Entity {
  uuid: string;
  name: string;
}

xdescribe("EntityMessenger", () => {
  let messenger: EntityMessageSender<Entity>;

  beforeEach(() => {
    messenger = new EntityMessageSender<Entity>();
  });

  it("should exist", () => {
    expect(messenger).toBeDefined();
  });

  it("should send a add-message when `add` is called");
  it("should send a update-message when `update` is called");
  it("should send a remove-message when `remove` is called");
  it("should send a sync-message when `sync` is called");

  it("should complete the observable of the `add`-function when the server responds with a message");
  it("should complete the observable of the `update`-function when the server responds with a message");
  it("should complete the observable of the `remove`-function when the server responds with a message");
  it("should complete the observable of the `sync`-function when the server responds with a message");

  it("should use the reviver for results retrieved through `add`-function");
  it("should use the reviver for results retrieved through `update`-function");
  it("should use the reviver for results retrieved through `remove`-function");
  it("should use the reviver for results retrieved through `sync`-function");
});
