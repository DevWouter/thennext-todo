import { MessageBusStateService } from "./message-bus-state.service";
import { MessageBusService, MessageBusStatus } from "./message-bus.service";
import { IMock, Mock, Times } from "typemoq";
import { BehaviorSubject } from "rxjs";

describe('MessageBusStateService', () => {
  let messageBusStateService: MessageBusStateService;
  let messageBusServiceMock: IMock<MessageBusService>;
  let statusSubject: BehaviorSubject<MessageBusStatus>;

  beforeEach(() => {
    statusSubject = new BehaviorSubject<MessageBusStatus>({
      origin: "client",
      status: "closed"
    });

    messageBusServiceMock = Mock.ofType<MessageBusService>();
    messageBusServiceMock.setup(x => x.status).returns(() => statusSubject);

    messageBusStateService = new MessageBusStateService(messageBusServiceMock.object);
  });

  it('should exist', () => {
    expect(messageBusStateService).toBeDefined();
  });

  it('should update open the connection when external is closed, but we want it open', (done) => {
    messageBusStateService.set("open");

    setTimeout(() => {
      expect(() => messageBusServiceMock.verify(x => x.connect(), Times.once())).not.toThrowError();
      done();
    }, 0);
  });

  it('should close the connection when external is open, but we want it closed', (done) => {
    statusSubject.next(<MessageBusStatus>{
      origin: "client",
      status: "connected"
    });

    setTimeout(() => {
      expect(() => messageBusServiceMock.verify(x => x.disconnect(), Times.once())).not.toThrow();
      done();
    }, 0);
  });

  it('should ignore the state when already set', (done) => {
    messageBusStateService.set("open");

    setTimeout(() => {
      // Open was called once.
      // Calling it a second time.
      messageBusStateService.set("open");
      setTimeout(() => {
        // It should now no try to open.
        expect(() => messageBusServiceMock.verify(x => x.connect(), Times.once())).not.toThrow();
        done();
      }, 0);
    }, 0);
  });

  it('The internal desired state should become closed when rejected', (done) => {
    // Open the connection
    messageBusStateService.set("open");
    // Tell the server has connected
    statusSubject.next(<MessageBusStatus>{
      origin: "client",
      status: "connected"
    });

    setTimeout(() => {
      messageBusServiceMock.reset();
      // The server rejects the connection for some reason.
      statusSubject.next(<MessageBusStatus>{
        origin: "server",
        status: "rejected"
      });

      setTimeout(() => {
        // And then for some reason still connects
        statusSubject.next(<MessageBusStatus>{
          origin: "server",
          status: "connected"
        });

        setTimeout(() => {
          // Then we expect it to close again.
          expect(() => messageBusServiceMock.verify(x => x.disconnect(), Times.once())).not.toThrow();
          done();
        }, 0);
      }, 0);
    }, 0);
  });

});
