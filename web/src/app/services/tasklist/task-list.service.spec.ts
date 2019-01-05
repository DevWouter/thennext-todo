import { TaskListService } from "./task-list.service";
import { IMock, Mock, It, Times } from "typemoq";

import { BehaviorSubject } from "rxjs";
import { take } from "rxjs/operators";

import {
  EntityMessageReceiver,
  EntityMessageSender,
  MessageBusService,
  MessageBusStatus,
  Repository,
  RepositoryFactoryService,
} from "../message-bus";
import { TaskList } from "../../models";

describe('Service: TasklistService', () => {
  let tasklistService: TaskListService;
  let messageBusServiceMock: IMock<MessageBusService>;
  let receiverMock: IMock<EntityMessageReceiver<TaskList>>;
  let senderMock: IMock<EntityMessageSender<TaskList>>;
  let repositoryFactoryServiceMock: IMock<RepositoryFactoryService>;
  let repositoryMock: IMock<Repository<TaskList>>;

  let statusObservable: BehaviorSubject<MessageBusStatus>;
  let tasklistEntries: BehaviorSubject<TaskList[]>;
  let listIn: TaskList;
  let listOut: TaskList;

  beforeEach(() => {
    listIn = Mock.ofType<TaskList>().object;
    listOut = Mock.ofType<TaskList>().object;

    statusObservable = new BehaviorSubject<MessageBusStatus>({
      origin: "client",
      status: "closed"
    });

    tasklistEntries = new BehaviorSubject<TaskList[]>([]);

    receiverMock = Mock.ofType<EntityMessageReceiver<TaskList>>();
    senderMock = Mock.ofType<EntityMessageSender<TaskList>>();

    repositoryMock = Mock.ofType<Repository<TaskList>>();
    repositoryMock.setup(x => x.entities).returns(() => tasklistEntries);

    repositoryFactoryServiceMock = Mock.ofType<RepositoryFactoryService>();
    repositoryFactoryServiceMock.setup(x => x.create(senderMock.object, receiverMock.object)).returns(() => repositoryMock.object);

    messageBusServiceMock = Mock.ofType<MessageBusService>();
    messageBusServiceMock.setup(x => x.status).returns(() => statusObservable);
    messageBusServiceMock.setup(x => x.createReceiver(It.isAny(), It.isAny())).returns(() => receiverMock.object);
    messageBusServiceMock.setup(x => x.createSender(It.isAny(), It.isAny())).returns(() => senderMock.object);

    tasklistService = new TaskListService(
      messageBusServiceMock.object,
      repositoryFactoryServiceMock.object
    );
  });

  it('should exist', () => {
    expect(tasklistService).toBeDefined();
  });

  it('should forward the entries from the repository', () => {
    expect(tasklistService.entries).toBe(tasklistEntries);
  });

  it('should invoke sync when connection is accepted', (done) => {
    statusObservable.next({ origin: "server", status: "accepted" });

    setTimeout(() => {
      expect(() => repositoryMock.verify(x => x.sync(), Times.once())).not.toThrow();
      done();
    }, 0);
  });

  it('should call add of repository', (done) => {
    repositoryMock.setup(x => x.add(listIn)).returns(() => new BehaviorSubject(listOut));

    tasklistService.add(listIn)
      .pipe(take(1)).subscribe(r => {
        expect(r).toBe(listOut);
        expect(() => repositoryMock.verify(x => x.add(listIn), Times.once())).not.toThrow();
        done();
      });
  });

  it('should call update of repository', (done) => {
    repositoryMock.setup(x => x.update(listIn)).returns(() => new BehaviorSubject(listOut));

    tasklistService.update(listIn).pipe(take(1))
      .subscribe((r => {
        expect(r).toBe(listOut);
        expect(() => repositoryMock.verify(x => x.update(listIn), Times.once())).not.toThrow();
        done();
      }));
  });

  it('should call delete of repository', (done) => {
    repositoryMock.setup(x => x.remove(listIn)).returns(() => new BehaviorSubject(undefined));

    tasklistService.delete(listIn)
      .pipe(take(1))
      .subscribe(() => {
        expect(() => repositoryMock.verify(x => x.remove(listIn), Times.once())).not.toThrow();
        done();
      });
  });
});
