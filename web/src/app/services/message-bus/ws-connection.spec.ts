import { WsConnection, WsConnectionCallbacks } from "./ws-connection";
import { WebSocket, Server } from "mock-socket";
import { environment } from "../../../environments/environment";

describe('WsConnection', () => {
  let originalWebSocket = undefined;
  let connection: WsConnection;
  let server: Server;
  let callbacks: jasmine.SpyObj<WsConnectionCallbacks>;

  beforeAll(() => {
    // Remember the original websocket
    originalWebSocket = window['WebSocket'];
    window['WebSocket'] = WebSocket;
  });

  afterAll(() => {
    // Restore the original websocket
    window['WebSocket'] = originalWebSocket;
  });

  beforeEach(() => {
    callbacks = jasmine.createSpyObj<WsConnectionCallbacks>("WsConnectionCallbacks", [
      "received",
      "connectionFailed",
      "connected",
      "disconnected"
    ]);

    // Create a new connection.
    server = new Server(environment.wsEndPoint);
    connection = new WsConnection();
  });

  afterEach(() => {
    server.stop();
  });

  it('should exist', () => {
    expect(connection).toBeDefined();
  });

  it('should throw an exception when sending before opening', () => {
    expect(() => { connection.send(""); }).toThrowError("WebSocket wasn't initialized");
  });

  it('should throw an exception when closing before opening', () => {
    expect(() => { connection.close(); }).toThrowError("WebSocket wasn't initialized");
  });

  it('should throw an exception when opening twice', () => {
    connection.open(callbacks);
    expect(() => connection.open(callbacks)).toThrowError("WebSocket was already opened");
  });

  it("should send messages", (done) => {
    server.on('connection', socket => {
      socket['on']('message', data => {
        expect(data).toBe("Hello from client");
        done();
      });
    });

    callbacks.connected.and.callFake(() => {
      connection.send("Hello from client");
    });

    connection.open(callbacks);
  });

  it("should report received messages", (done) => {
    server.on('connection', socket => {
      socket.send("Hello from server");
    });

    callbacks.received.and.callFake((message) => {
      expect(message).toBe("Hello from server");
      done();
    });
    connection.open(callbacks);
  });

  it("should report a connection failure event", (done) => {
    server.stop();

    // Create a new server that rejects.
    server = new Server(environment.wsEndPoint, {
      verifyClient: () => false,
      selectProtocol: undefined
    });

    callbacks.disconnected.and.callFake(() => {
      expect(callbacks.connectionFailed).toHaveBeenCalledTimes(1);
      expect(callbacks.disconnected).toHaveBeenCalledTimes(1);
      done();
    });

    connection.open(callbacks);
  });

  it("should close the connection", (done) => {
    callbacks.disconnected.and.callFake(() => {
      expect(callbacks.connected).toHaveBeenCalledTimes(1);
      expect(callbacks.disconnected).toHaveBeenCalledTimes(1);
      expect(server.clients().length).toBe(0, "server should no longer have any clients");
      done();
    });

    callbacks.connected.and.callFake(() => {
      expect(server.clients().length).toBe(1);
      connection.close();
    });

    connection.open(callbacks);
  });

  it("should report disconnect event", (done) => {
    server.on('connection', socket => {
      socket.close();
    });

    callbacks.disconnected.and.callFake(() => {
      expect(callbacks.disconnected).toHaveBeenCalledTimes(1);
      done();
    });

    connection.open(callbacks);
  });


});
