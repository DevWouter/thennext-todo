import { WsConnectionFactory } from "./ws-connection-factory";

describe('WsConnectionFactory', () => {
  let factory: WsConnectionFactory;

  beforeEach(() => {
    factory = new WsConnectionFactory();
  });

  it("should exists", () => {
    expect(factory).toBeDefined();
  });

  it("should create EntityRefIdGenerator", () => {
    var refGenerator = factory.createRefId("tag");
    expect(refGenerator).toBeDefined();
    expect(refGenerator.next()).toMatch(/^0\-tag\-/, "because we provided the tag");
  });

  it("should create connection", () => {
    var connection = factory.create();
    expect(connection).toBeDefined();
  });

  it("should return the same connection when asking for a second time", () => {
    var connection1 = factory.create();
    var connection2 = factory.create();
    expect(connection1).toBe(connection2, "since any second request should result in the same connection");
  });
});
