/**
 * The state of the MessageBus
 */
export interface MessageBusState {
  /**
   * What the current state of the messagebus is.
   */
  connection: MessageBusStateConnection;
}

export interface MessageBusStateRejection {
  cause: "connection" | "auth";
  reason?: string;
}

/**
 * The connection state of the message bus.
 */
export interface MessageBusStateConnection {
  /**
   * Is the service trying to be connected?
   */
  activated: boolean;

  /**
   * Is the service connected?
   * Requires: activated.
   */
  connected: boolean;

  /**
   * Is the service authenticated?
   * Requires: activated and connected.
   */
  authenticated: boolean;

  /**
   * Contains a property that a connection was rejected.
   */
  error: MessageBusStateRejection | null;
}

