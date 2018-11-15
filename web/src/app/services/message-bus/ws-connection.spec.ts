import { WsConnection, WsConnectionInterface, WsConnectionControlInterface } from "./ws-connection";

import {
  WebSocket as FakeSocket,
  Server as FakeServer
} from "mock-socket";

import { WsEvent } from "../ws/events";
import { skip, take } from "rxjs/operators";
import { SetTokenCommand } from "../ws/commands";

describe('WsConnection', () => {
  let ORIGINAL_WEBSOCKET = undefined;
  let connection: WsConnectionInterface & WsConnectionControlInterface;
  let server: FakeServer;

  beforeAll(() => {
    if (window['WebSocket'] !== FakeSocket) {
      ORIGINAL_WEBSOCKET = window['WebSocket'];
      window['WebSocket'] = FakeSocket;
    }
  });

  afterAll(() => {
    window['WebSocket'] = ORIGINAL_WEBSOCKET;
  });

  beforeEach(() => {
    server = new FakeServer("ws://localhost");
    connection = new WsConnection({
      url: "ws://localhost"
    });
  });

  afterEach(() => {
    server.close();
  });

  it("should connect when `open()` command is called", (done) => {
    server.on("connection", (socket) => {
      expect().nothing();
      done();
    });

    connection.open();
  });

  it("should throw an error when `open()` is called for a second time", () => {
    const call = () => connection.open();
    expect(call).not.toThrowError();
    expect(call).toThrowError("connection is already created");
  });

  it("should disconnect when `close()` command is called", (done) => {
    server.on("connection", (socket) => {
      socket.addEventListener("close", () => {
        expect().nothing();
        done();
      });
    });

    connection.open();
    connection.close();
  });

  it("should throw an error when `close()` is called before the connection is opened", () => {
    const call = () => connection.close();
    expect(call).toThrowError("connection is closed, call `open` first");
  });

  it("should throw an error when `close()` is called a second time after it was opened", () => {
    connection.open();
    const call = () => connection.close();
    call(); // First call it normally.
    expect(call).toThrowError("connection is closed, call `open` first");
  });

  it("should emit status `closed` when no conneciton was made", (done) => {
    connection.status().subscribe(ev => {
      expect(ev.status).toBe("closed");
      expect(ev.origin).toBe("client");
      done();
    });
  });

  it("should emit status `connecting` as status when `open()` is called", (done) => {
    connection.status()
      .pipe(skip(1), take(1))
      .subscribe(x => {
        expect(x.status).toBe("connecting");
        done();
      });

    connection.open();
  });

  it("should emit status `connected` as status when connection is established", (done) => {
    connection.status()
      .pipe(skip(2), take(1))
      .subscribe(x => {
        expect(x.status).toBe("connected");
        done();
      });

    connection.open();
  });

  it("should emit status `closing by client` when the client calls `close()`", (done) => {
    server.on("connection", socket => {
      // When connected let the client close the connection.
      connection.close();
    });

    connection.status()
      .pipe(skip(3), take(1))
      .subscribe(x => {
        expect(x.status).toBe("closing");
        expect(x.origin).toBe("client");
        done();
      });

    connection.open();
  });

  it("should emit status `closed by client` when the client has closed the connection", (done) => {
    server.on("connection", socket => {
      // When connected let the client close the connection.
      connection.close();
    });

    connection.status()
      .pipe(skip(4), take(1))
      .subscribe(x => {
        expect(x.status).toBe("closed");
        expect(x.origin).toBe("client");
        done();
      });

    connection.open();
  });

  it("should emit status `closed by server` when server has closed the connection", (done) => {
    server.on("connection", socket => {
      // When connected let the client close the connection.
      socket.close();
    });

    connection.status()
      .pipe(skip(3), take(1))
      .subscribe(x => {
        expect(x.status).toBe("closed");
        expect(x.origin).toBe("server");
        done();
      });

    connection.open();
  });

  it("should report messages send by the server", (done) => {
    server.on("connection", socket => {
      socket.send(JSON.stringify(<WsEvent<"token-accepted">>{
        data: {},
        echo: true,
        refId: "answer",
        type: "token-accepted"
      }));
    });

    connection.open();
    connection.events().subscribe(ev => {
      expect(ev.type).toBe("token-accepted");
      expect(ev.refId).toBe("answer");
      done();
    });
  });

  it("should send commands to the server", (done) => {
    server.on("connection", socket => {
      socket["on"]("message", (data) => {
        const cmd = JSON.parse(data) as { command: string, data: SetTokenCommand };
        expect(cmd.data.token).toBe("abcdef");
        done();
      });
    });

    connection.open();
    connection.send("set-token", { token: "abcdef" });
  });

  it("should throw an error when sending a message when the connection is not open", () => {
    const call = () => connection.send("set-token", { token: "abcdef" });

    expect(call).toThrowError("connection is closed, call `open` first");
  });
});
