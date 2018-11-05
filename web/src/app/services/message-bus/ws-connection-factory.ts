import { WsConnectionInterface } from "./ws-connection";

/**
 * Wrapper around the RxJS websocket
 */
export interface WsConnectionFactoryInterface {
  create(): WsConnectionInterface;
}
