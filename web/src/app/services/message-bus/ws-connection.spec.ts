import { WsConnection } from "./ws-connection";

import {
  WebSocket as FakeSocket,
  Server as FakeServer
} from "mock-socket";

import { WsEvent } from "../ws/events";

xdescribe('WsConnection', () => {
  let ORIGINAL_WEBSOCKET = undefined;
  let connection: WsConnection;
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
    connection = new WsConnection();
  });

  afterEach(() => {
    server.close();
  });

  it("should report messages send by server");
  it("should send commands to the server");
  it("should open a connection when subscribing");
  it("should report a disconnect");
  it("should have a state subscription event");
  it("should thrown an error when `send` is called when nothing is subscribed to the events");
});
