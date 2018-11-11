import { WsConnectionInterface, WsConnection } from "./ws-connection";
import { EntityRefIdGenerator, EntityRefIdGeneratorInterface } from "./entity-refid-generator";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

/**
 * Wrapper around the RxJS websocket
 */
export interface WsConnectionFactoryInterface {
  create(): WsConnectionInterface;
  createRefId(tag: string): EntityRefIdGeneratorInterface;
}

@Injectable()
export class WsConnectionFactory implements WsConnectionFactoryInterface {
  private connection: WsConnectionInterface;

  create(): WsConnectionInterface {
    if(this.connection === undefined){
      this.connection = new WsConnection();
    }

    return this.connection;
  }

  createRefId(tag: string): EntityRefIdGeneratorInterface {
    return new EntityRefIdGenerator(tag);
  }
}
