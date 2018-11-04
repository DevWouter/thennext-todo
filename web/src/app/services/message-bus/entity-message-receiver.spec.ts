import { EntityMessageReceiver } from "./entity-message-receiver";

interface FakeUser {
  uuid: string;
  name: string;
}

describe("EntityMessageReceiver", () => {
  let receiver: EntityMessageReceiver<FakeUser>;

  beforeEach(() => {
    receiver = new EntityMessageReceiver();
  });

  it("should exists", () => {
    expect(receiver).toBeDefined();
  });

  it("should listen to 'user-entity' messages for `onAdd` that are not echo");
  it("should listen to 'user-entity' messages for `onUpdate` that are not echo");
  it("should listen to 'user-entity' messages for `onRemove` that are not echo");

  it("should ignore all echo message for `onAdd`");
  it("should ignore all echo message for `onUpdate`");
  it("should ignore all echo message for `onRemove`");

  it("should ignore all message from another type for `onAdd`");
  it("should ignore all message from another type for `onUpdate`");
  it("should ignore all message from another type for `onRemove`");

  it("should use the reviver when `onAdd` occurs");
  it("should use the reviver when `onUpdate` occurs");
});
