/**
 * The state of the MessageBus
 */
export interface MessageBusState {
  /**
   * What the current state of the messagebus is.
   */
  connection: MessageBusStateConnection;
};

/**
 * The connection state of the message bus.
 */
export interface MessageBusStateConnection {
  /**
   * Is the service trying to be connected?
   */
  activated: boolean;

  /**
   * What is the current connection activation attempt.
   * If 0 then no connection attempt was made.
   * If 1 then it's the current connection attempt.
   * If 2 then then a previous connection attempt has failed.
   */
  attempt: number;

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
   * Is the connection rejected (server wasn't ready).
   */
  connectionRejected: boolean;

  /**
   * Is the authentication rejected?
   */
  authenticationRejected: boolean;

  /**
   * The optional rejection message by the server.
   */
  rejectionMessage: string | null;
};

