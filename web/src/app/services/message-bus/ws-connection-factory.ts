import { WsConnectionInterface } from "./ws-connection";
import { EntityRefIdGenerator } from "./entity-refid-generator";

/**
 * Wrapper around the RxJS websocket
 */
export interface WsConnectionFactoryInterface {
  create(): WsConnectionInterface;
  createRefId(tag: string): EntityRefIdGenerator;
}
