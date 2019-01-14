import { MessageBusService } from "./message-bus.service";
import { IMock, Mock } from 'typemoq';
import { TokenService } from '../token.service';
import { of } from 'rxjs';

describe('Service: MessageBus', () => {
  let service: MessageBusService;
  let tokenServiceMock: IMock<TokenService>;

  beforeEach(() => {
    tokenServiceMock = Mock.ofType<TokenService>();

    tokenServiceMock.setup(x => x.token).returns(() => of<string>(undefined));

    service = new MessageBusService(tokenServiceMock.object);
  });

  it('should exist', () => {
    expect(service).toBeTruthy();
  });
});
