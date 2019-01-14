import { MessageBusService } from "./message-bus.service";
import { IMock, Mock } from 'typemoq';
import { TokenService } from '../token.service';
import { Subject } from 'rxjs';

import {
  WebSocket as FakeSocket,
  Server as FakeServer
} from "mock-socket";
import { environment } from '../../../environments/environment';
import { WsCommandMap, SetTokenCommand } from '../ws/commands';
import { filter, take } from 'rxjs/operators';

describe('Service: MessageBus', () => {
  let ORIGINAL_WEBSOCKET = undefined;
  let server: FakeServer;

  let service: MessageBusService;
  let tokenServiceMock: IMock<TokenService>;
  let tokenSubject: Subject<string>;

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
    tokenSubject = new Subject();
    server = new FakeServer(environment.wsEndPoint);
    tokenServiceMock = Mock.ofType<TokenService>();

    tokenServiceMock.setup(x => x.token).returns(() => tokenSubject);

    service = new MessageBusService(tokenServiceMock.object);
  });

  afterEach(() => {
    server.close();
  });

  it('should exist', () => {
    expect(service).toBeTruthy();
  });

  it('should connect', (done) => {
    server.on("connection", () => {
      expect().nothing();
      done();
    });

    service.connect();
  });


  it('should disconnect', (done) => {
    server.on("connection", (connection) => {
      connection.addEventListener("close", () => {
        expect().nothing();
        done();
      });

      service.disconnect();
    });

    service.connect();
  });

  it('should send the set-token after connecting', (done) => {
    server.on("connection", socket => {
      socket["on"]("message", (data) => {
        const givenCmd = JSON.parse(data) as { command: keyof WsCommandMap, data: SetTokenCommand };
        expect(givenCmd.command).toBe("set-token");
        expect(givenCmd.data.token).toBe("my-fake-token");
        done();
      });
    });

    service.connect();
    tokenSubject.next("my-fake-token");
  });

  it('should send', (done) => {
    server.on("connection", socket => {
      socket["on"]("message", (data) => {
        const givenCmd = JSON.parse(data) as { command: keyof WsCommandMap, data: object };
        expect(givenCmd.command).toBe("sync-my-account");
        done();
      });

      service.send("sync-my-account", {});
    });

    service.connect();
  });

  it('should update the status when token-accepted', (done) => {
    server.on("connection", socket => {
      socket.send(JSON.stringify({ echo: true, type: "token-accepted" }));
    });

    service.status.pipe(filter(x => x.status === "accepted"), take(1)).subscribe(() => {
      expect().nothing();
      done();
    });

    service.connect();
  });

  it('should update the status when token-rejected', (done) => {
    server.on("connection", socket => {
      socket.send(JSON.stringify({ echo: true, type: "token-rejected" }));
    });

    service.status.pipe(filter(x => x.status === "rejected"), take(1)).subscribe(() => {
      expect().nothing();
      done();
    });

    service.connect();
  });


  it('should listen to specefic events', (done) => {
    server.on("connection", socket => {
      socket.send(JSON.stringify({ echo: true, type: "my-account-synced" }));
    });

    service.eventsOf("my-account-synced").pipe(take(1)).subscribe(ev => {
      expect().nothing();
      done();
    });

    service.connect();
  });

  it('should create a receiver', () => {
    const receiver = service.createReceiver("fake-entity", (k, v) => v);
    expect(receiver).toBeTruthy();
  });

  it('should create a sender', () => {
    const sender = service.createSender("fake-entity", (k, v) => v);
    expect(sender).toBeTruthy();
  });
});
