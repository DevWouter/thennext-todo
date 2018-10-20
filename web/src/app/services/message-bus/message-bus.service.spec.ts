import { TestBed } from "@angular/core/testing";

import { MessageBusService } from "./message-bus.service";
import { MessageBusConfigService, MessageBusConfig } from "./message-bus-config.service";
import { of, Observable, BehaviorSubject, Subject } from "rxjs";


describe("MessageBusService", () => {
  let messageBus: MessageBusService;
  let config = new BehaviorSubject<MessageBusConfig>({ active: false, token: null });

  beforeEach(() => {
    const fakeMessageBusConfig = {
      get state(): Observable<MessageBusConfig> { return config; }
    };

    TestBed.configureTestingModule({
      providers: [
        MessageBusService,
      ]
    });

    messageBus = TestBed.get(MessageBusService);
  });

  it("should be created", () => {
    expect(messageBus).toBeTruthy();
  });

  it("should report actived=true  when calling connect");
  it("should report actived=false when calling disconnect");
  it("should report connected=true  when WS connection is made");
  it("should report connected=false when WS connection is made");
  it("should report authenticated=true  when server reports the auth-token was ok");
  it("should report authenticated=false when server reports the auth-token was bad");
  it("should report authenticationRejected=true  when server reports the auth-token was bad");
  it("should report authenticationRejected=false when server reports the auth-token was ok");
  it("should report connectionRejected=true  when WS connection attempt fails");
  it("should report connectionRejected=false when WS connection attempt was ok");

  it("should increase increase the attempt counter when connecting");
  it("should the server respond with a rejection message the state should have that message");

  it("should report when the connection was disconnected");
  it("should report when it reconnects");
  it("should automatically reconnect when the connection has lost");
});
