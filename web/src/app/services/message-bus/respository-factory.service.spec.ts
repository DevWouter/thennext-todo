import { RepositoryFactoryService } from "./respository-factory.service";
import { IMock, Mock } from "typemoq";
import { Entity } from "../../models/entity";
import { EntityMessageSenderInterface } from "./entity-message-sender";
import { EntityMessageReceiverInterface } from "./entity-message-receiver";
import { BehaviorSubject, Subject } from "rxjs";

interface FakeEntity extends Entity {

}

describe('RepositoryFactoryService', () => {
  let sender: IMock<EntityMessageSenderInterface<FakeEntity>>;
  let receiver: IMock<EntityMessageReceiverInterface<FakeEntity>>;
  let factory: RepositoryFactoryService;

  beforeEach(() => {
    sender = Mock.ofType<EntityMessageSenderInterface<FakeEntity>>();
    receiver = Mock.ofType<EntityMessageReceiverInterface<FakeEntity>>();

    receiver.setup(x => x.onAdd()).returns(() => new Subject<{ data: FakeEntity }>());
    receiver.setup(x => x.onUpdate()).returns(() => new Subject<{ data: FakeEntity }>());
    receiver.setup(x => x.onRemove()).returns(() => new Subject<{ uuid: string }>());

    factory = new RepositoryFactoryService();
  });

  it('should exist', () => {
    expect(factory).toBeDefined();
  });

  it('should create a repository', () => {
    let repo = factory.create(sender.object, receiver.object);
    expect(repo).toBeDefined();
  })
});
