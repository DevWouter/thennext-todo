import { TestBed } from "@angular/core/testing";

import { Observable, BehaviorSubject } from "rxjs";
import { filter, skipUntil, skip } from "rxjs/operators";

import { MessageBusService } from "./message-bus.service";
import { MessageBusConfigService } from "./message-bus-config.service";
import { WsConnection } from "./ws-connection";
import { WsEventBasic, WsEvent } from "../ws/events";
import { MessageBusConfig } from "./message-bus-config";


describe("MessageBusService", () => {
  let messageBus: MessageBusService;
  let config: BehaviorSubject<MessageBusConfig>;
  let wsServiceSpy: jasmine.SpyObj<WsConnection>;

  beforeEach(() => {
    config = new BehaviorSubject<MessageBusConfig>({ active: false, token: null });

    const fakeMessageBusConfig = {
      get state(): Observable<MessageBusConfig> { return config; }
    };

    wsServiceSpy = jasmine.createSpyObj<WsConnection>("WsConnection", [
      "open",
      "close",
      "send"
    ]);

    // TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        MessageBusService,
        { provide: MessageBusConfigService, useValue: fakeMessageBusConfig },
        { provide: WsConnection, useValue: wsServiceSpy },
      ]
    });

    messageBus = TestBed.get(MessageBusService);
  });

  it("should be created", () => {
    expect(messageBus).toBeTruthy();
  });

  it("should report actived=true  when calling connect", done => {
    messageBus.state.pipe(filter(x => x.connection.activated === true))
      .subscribe(x => {
        expect(x.connection.activated).toBe(true);
        done();
      }, error => fail(error));
    config.next({ active: true, token: null });
  });

  it("should report actived=false when calling disconnect", () => {
    messageBus.state.pipe(
      skipUntil(messageBus.state.pipe(filter(y => y.connection.activated))), // Wait until activated once
      skip(1)) // Skip the activation message
      .subscribe(x => {
        expect(x.connection.activated).toBe(false);
      }, error => fail(error));

    config.next({ active: true, token: null }); // Activate
    config.next({ active: false, token: null }); // Deactivate
  });

  it("should invoke the connect function of WS service when activated", () => {
    config.next({ active: true, token: null });
    expect(wsServiceSpy.open).toHaveBeenCalledTimes(1);
  });

  it("should invoke the disconnect function of WS service when deactivated", () => {
    config.next({ active: true, token: null });
    config.next({ active: false, token: null });
    expect(wsServiceSpy.close).toHaveBeenCalledTimes(1);
  });

  it("should not invoke the connect more than once", () => {
    config.next({ active: true, token: null });
    config.next({ active: true, token: null });
    expect(wsServiceSpy.open).toHaveBeenCalledTimes(1);
  });

  it("should not invoke the disconnect more than once", () => {
    config.next({ active: true, token: null });
    config.next({ active: false, token: null });
    config.next({ active: false, token: null });
    expect(wsServiceSpy.close).toHaveBeenCalledTimes(1);
  });

  it("should provide the wsServiceSpy with a callback", () => {
    config.next({ active: true, token: null });

    expect(wsServiceSpy.open).toHaveBeenCalledWith(messageBus.callbacks);
  });

  it("should report when the connection was connected", (done) => {
    messageBus.state.pipe(
      filter(x => x.connection.connected === true)) // Only continue when activated
      .subscribe(x => {
        expect(x.connection.connected).toBe(true);
        done();
      }, error => fail(error));

    messageBus.callbacks.connected();
  });

  it("should report when the connection was disconnected", (done) => {
    messageBus.state.pipe(
      skipUntil(messageBus.state.pipe(filter(y => y.connection.connected))),
      skip(1)
    ).subscribe(x => {
      expect(x.connection.connected).toBe(false);
      done();
    }, error => fail(error));

    messageBus.callbacks.connected();    // First be connected
    messageBus.callbacks.disconnected(); // Then be disconnected
  });

  it("should report rejected.cause=connection when WS connection attempt fails", (done) => {
    messageBus.state.pipe(
      skipUntil(messageBus.state.pipe(filter(y => y.connection.activated))),
      skip(1)
    ).subscribe(x => {
      expect(x.connection.error.cause).toBe("connection");
      done();
    }, error => fail(error));

    config.next({ active: true, token: null });
    messageBus.callbacks.connectionFailed();
  });

  it("should report authenticated=true  when server reports the auth-token was ok", (done) => {
    messageBus.state.pipe(
      skip(1) // Skip the default state
    ).subscribe(x => {
      expect(x.connection.authenticated).toBe(true);
      done();
    }, error => fail(error));

    var message: WsEventBasic = {
      type: "token-accepted",
      echo: true, // It is an echo since we send it.
    };

    messageBus.callbacks.received(JSON.stringify(message));
  });

  it("should report authenticated=false and have an error when server reports the auth-token was bad", (done) => {
    messageBus.state.pipe(
      skipUntil(messageBus.state.pipe(filter(y => !!y.connection.error))),
    ).subscribe(x => {
      expect(x.connection.authenticated).toBe(false, "since authentcation has failed it must be set to false");
      expect(x.connection.error.cause).toBe("auth", "Always tell the reason for the authentication");
      expect(x.connection.error.reason).toBe("Testing reasons", "When authentication fails we should also have an error reason from the server");
      done();
    }, error => fail(error));

    var acceptedMessage: WsEvent<"token-accepted"> = {
      type: "token-accepted",
      echo: true, // It is an echo since we send it.
      data: {}
    };

    var rejectedMessage: WsEvent<"token-rejected"> = {
      type: "token-rejected",
      echo: true, // It is an echo since we send it.
      data: { reason: "Testing reasons" }
    };

    messageBus.callbacks.received(JSON.stringify(acceptedMessage));
    messageBus.callbacks.received(JSON.stringify(rejectedMessage));
  });

  it("should automatically reconnect when the connection has lost", () => {
    config.next({ active: true, token: null });

    messageBus.callbacks.connected();
    messageBus.callbacks.disconnected();

    expect(wsServiceSpy.open).toHaveBeenCalledTimes(2);
  });

  it("should send the authentication token when active and token was found", () => {
    config.next({ active: true, token: "abcdef" });
    expect(wsServiceSpy.send).toHaveBeenCalledTimes(0);
    messageBus.callbacks.connected();
    expect(wsServiceSpy.send).toHaveBeenCalledWith(JSON.stringify({ command: "set-token", data: { token: "abcdef" } }));
  });


  it("should NOT automatically reconnect when authentication failed", () => {
    config.next({ active: true, token: null });

    messageBus.callbacks.connected();

    var rejectedMessage: WsEvent<"token-rejected"> = {
      type: "token-rejected",
      echo: true, // It is an echo since we send it.
      data: { reason: "Testing reasons" }
    };

    messageBus.callbacks.received(JSON.stringify(rejectedMessage));
    messageBus.callbacks.disconnected(); // The server disconnects when a rejection message was send.

    expect(wsServiceSpy.open).toHaveBeenCalledTimes(1);
  });

  it("should automatically resend the token after connection was lost", () => {
    config.next({ active: true, token: "abcdef" });

    messageBus.callbacks.connected();
    messageBus.callbacks.disconnected();
    messageBus.callbacks.connected();

    expect(wsServiceSpy.send).toHaveBeenCalledTimes(2);
  });

  it("should throw when no authentication was made and someone sends a message", () => {
    messageBus.callbacks.connected();
    expect(() => {
      messageBus.send("sync-my-account", {});
    }).toThrowError("The messagebus is not authenticated");
  });

  it("should throw when a manual authentication is made", () => {
    messageBus.callbacks.connected();
    expect(() => {
      messageBus.send("set-token", { token: "illegal" });
    }).toThrowError("The messagebus performs set-token internal");
  });

  it("should send commands after authentication", () => {
    var acceptedMessage: WsEvent<"token-accepted"> = {
      type: "token-accepted",
      echo: true, // It is an echo since we send it.
      data: {}
    };

    messageBus.callbacks.connected();
    messageBus.callbacks.received(JSON.stringify(acceptedMessage));
    messageBus.send("sync-my-account", {});

    expect(wsServiceSpy.send).toHaveBeenCalledWith(JSON.stringify({ command: "sync-my-account", data: {} }));
  });
});
