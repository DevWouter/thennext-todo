import { TestBed } from "@angular/core/testing";

import { MessageBusConfigService } from "./message-bus-config.service";

describe("MessageBusConfigService", () => {
  let service: MessageBusConfigService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageBusConfigService]
    });

    service = TestBed.get(MessageBusConfigService);
  });

  it("should have a missing connection state", done => {
    service.state.subscribe(x => {
      expect(x).toBeDefined("The service should always have a state");
      expect(x.active).toBe(false, "The service should have no desire to be active");
      expect(x.token).toBeNull("The service should not have a token to begin with");
      done();
    });
  });

  it("should update token and not effect desired connection state", done => {
    const newToken = "new-token";
    service.update({ token: newToken });
    service.state.subscribe(x => {
      expect(x).toBeDefined("The service should always have a state");
      expect(x.active).toBe(false, "The service should not have updated the active state");
      expect(x.token).toBe(newToken, "The service should have updated the desired token");
      done();
    });
  });

  it("should update desired connection state and not effect token", done => {
    const newActive = true;
    service.update({ active: newActive });
    service.state.subscribe(x => {
      expect(x).toBeDefined("The service should always have a state");
      expect(x.active).toBe(newActive, "The service should have updated the active state");
      expect(x.token).toBeNull("The service should have not have updated the desired token");
      done();
    });
  });
});
