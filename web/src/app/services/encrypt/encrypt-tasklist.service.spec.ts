import { Mock, IMock, Times, It } from 'typemoq';

import { BehaviorSubject } from 'rxjs';


import { randomBytes, verify } from "tweetnacl";
import { encodeBase64 } from "tweetnacl-util";
import { TaskList, Task, ChecklistItem } from '../../models';
import { TaskService } from '../task.service';
import { ChecklistItemService } from '../checklist-item.service';

import { EncryptTasklistService } from './encrypt-tasklist.service';
import { EncryptTaskService } from './encrypt-task.service';
import { EncryptKeysStorageService } from './encrypt-keys-storage.service';


describe('Service: EncryptTasklist', () => {
  let service: EncryptTasklistService;

  let encryptKeysStorageServiceMock: IMock<EncryptKeysStorageService>;
  let encryptTaskServiceMock: IMock<EncryptTaskService>;

  let taskServiceMock: IMock<TaskService>;
  let checklistItemServiceMock: IMock<ChecklistItemService>

  let validPk: Uint8Array;
  let validPkString: string;
  let listA: TaskList;

  let taskObservable: BehaviorSubject<Task[]>;
  let checklistItemObservable: BehaviorSubject<ChecklistItem[]>;

  beforeEach(() => {
    taskObservable = new BehaviorSubject<Task[]>([]);
    checklistItemObservable = new BehaviorSubject<ChecklistItem[]>([]);


    validPk = randomBytes(32);
    validPkString = encodeBase64(validPk);
    listA = <TaskList>{ uuid: "list-a", name: "List A" };


    encryptKeysStorageServiceMock = Mock.ofType<EncryptKeysStorageService>();
    encryptTaskServiceMock = Mock.ofType<EncryptTaskService>();
    taskServiceMock = Mock.ofType<TaskService>();
    checklistItemServiceMock = Mock.ofType<ChecklistItemService>();

    taskServiceMock.setup(x => x.entries).returns(() => taskObservable);

    service = new EncryptTasklistService(
      encryptKeysStorageServiceMock.object,
      encryptTaskServiceMock.object,
      taskServiceMock.object,
    );
  });

  it('should exist', () => {
    expect(service).toBeTruthy();
  });

  // TODO: Move to encrypt service.
  describe("validate private key", () => {
    it('should check if private key is valid encoded', () => {
      const pk = "invalid-key";
      let validationRules = service.validatePrivateKey(pk);
      expect(validationRules).toContain("WRONG_PK_ENCODING");
    });

    it('should check if private key is not too short', () => {
      const pk = encodeBase64(randomBytes(31));
      let validationRules = service.validatePrivateKey(pk);
      expect(validationRules).toContain("WRONG_PK_LENGTH");
    });

    it('should check if private key is not too long', () => {
      const pk = encodeBase64(randomBytes(33));
      let validationRules = service.validatePrivateKey(pk);
      expect(validationRules).toContain("WRONG_PK_LENGTH");
    });
  });

  it('should store the private key in tasklistKeysService when encrypting a list', () => {
    service.encrypt(listA, validPkString);
    expect(() => encryptKeysStorageServiceMock.verify(x => x.set(listA.uuid, It.is(x => verify(x, validPk))), Times.once())).not.toThrow();
  });

  it('should call the encrypt function for each task in the list', (done) => {
    const validTask = <Task>{ taskListUuid: "list-a" };
    const tasks: Task[] = [
      validTask,
    ];

    taskObservable.next(tasks);

    service.encrypt(listA, validPkString).subscribe(() => {
      expect(() => encryptTaskServiceMock.verify(x => x.encrypt(It.is(x => verify(x, validPk)), It.isValue(validTask)), Times.once())).not.toThrow();
      done();
    });
  });

  it('should not encrypt tasks from another list', (done) => {
    const invalidTask = <Task>{ taskListUuid: "list-b" };
    const tasks: Task[] = [
      invalidTask,
    ];

    taskObservable.next(tasks);

    service.encrypt(listA, validPkString).subscribe(() => {
      expect(() => encryptTaskServiceMock.verify(x => x.encrypt(It.is(x => verify(x, validPk)), It.isValue(invalidTask)), Times.never())).not.toThrow();
      done();
    });
  });

  it('should encrypt checklist-items of the task');

  it('should not encrypt checklist-items of other tasks');
});
