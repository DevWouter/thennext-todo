import { Mock, IMock, Times, It } from 'typemoq';

import { randomBytes, secretbox } from "tweetnacl";
import { encodeBase64, decodeBase64 } from "tweetnacl-util";

import { TaskList, Task, ChecklistItem } from '../../models';

import { EncryptService } from './encrypt.service';
import { EncryptKeysStorageService } from './encrypt-keys-storage.service';


describe('Service: Encrypt', () => {
  let service: EncryptService;
  let encryptTaskSpy: jasmine.Spy;
  let encryptChecklistItemSpy: jasmine.Spy;

  let encryptKeysStorageServiceMock: IMock<EncryptKeysStorageService>;

  let privateKey: Uint8Array;
  let tasklist: TaskList;


  let validTask: Task;
  let validChecklistItem: ChecklistItem;

  let invalidTask: Task;
  let invalidChecklistItem: ChecklistItem;

  beforeEach(() => {
    privateKey = randomBytes(32);
    tasklist = <TaskList>{ uuid: "list-a", name: "List A" };

    validTask = <Task>{ taskListUuid: "list-a", uuid: "task-valid" };
    validChecklistItem = <ChecklistItem>{ title: "checklistItem-title", taskUuid: "task-valid" };

    invalidTask = <Task>{ taskListUuid: "list-b", uuid: "task-invalid" };
    invalidChecklistItem = <ChecklistItem>{ taskUuid: "task-invalid" };

    encryptKeysStorageServiceMock = Mock.ofType<EncryptKeysStorageService>();

    service = new EncryptService(
      encryptKeysStorageServiceMock.object,
    );

    encryptTaskSpy = spyOn(service, "encryptTask").and.callThrough();
    encryptChecklistItemSpy = spyOn(service, "encryptChecklistItem").and.callThrough();
  });

  describe("Validate Private Key", () => {
    it('should check if private key is valid base64 encoded', () => {
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

  describe("Tasklist", () => {
    it('should store the private key in tasklistKeysService when encrypting a list', () => {
      service.encryptTaskList(privateKey, tasklist, [], []);
      expect(() => encryptKeysStorageServiceMock.verify(x => x.set(tasklist.uuid, It.isValue(privateKey)), Times.once())).not.toThrow();
    });

    it('should call the encrypt function for each task in the list', () => {
      service.encryptTaskList(privateKey, tasklist, [validTask], []);
      expect(encryptTaskSpy).toHaveBeenCalledWith(privateKey, validTask, []);
    });

    it('should not encrypt tasks from another list', () => {
      const act = () => service.encryptTaskList(privateKey, tasklist, [invalidTask], []);
      expect(act).toThrowError("Task unrelated to the tasklist cannot be encrypted with given tasklist");
    });

    it('should not encrypt checklist-items of other tasks', () => {
      const act = () => service.encryptTaskList(privateKey, tasklist, [validTask], [invalidChecklistItem]);
      expect(act).toThrowError("ChecklistItem unrelated to the tasklist cannot be encrypted with given tasklist");
    });
  });

  describe('Task', () => {
    let task: Task;
    let act: () => void;
    beforeEach(() => {
      task = <Task>{ title: "task-title", description: "task-description" };

      act = () => service.encryptTask(privateKey, task, []);
    });

    it('should exist', () => {
      expect(service).toBeDefined();
    });

    it('should throw if encrypting a task that is already encrypted', () => {
      task.pkNonce = "fake-nonce";
      expect(act).toThrowError("task already has pkNonce set and can not be encrypted again");
    });

    it('should add the nonce used for the task to the tasks', () => {
      act();
      expect(task.pkNonce).toBeDefined();
      expect(() => decodeBase64(task.pkNonce)).not.toThrow();
    })

    it('should encrypt the title of the task', () => {
      act();
      expect(task.title).toBe(encodeBase64(
        secretbox(new TextEncoder().encode("task-title"), decodeBase64(task.pkNonce), privateKey)
      ));
    });

    it('should encrypt the description of the task', () => {
      act();
      expect(task.description).toBe(encodeBase64(
        secretbox(new TextEncoder().encode("task-description"), decodeBase64(task.pkNonce), privateKey)
      ));
    });
  });

  describe("ChecklistItem", () => {
    it('should encrypt checklist-items of the task', () => {
      service.encryptTaskList(privateKey, tasklist, [validTask], [validChecklistItem]);
      expect(encryptChecklistItemSpy).toHaveBeenCalledWith(privateKey, decodeBase64(validTask.pkNonce), validChecklistItem);
    });

    it('should encrypt the title of the checklist item', () => {
      const pkNonce = randomBytes(24);
      service.encryptChecklistItem(privateKey, pkNonce, validChecklistItem);

      expect(validChecklistItem.title).toBe(encodeBase64(
        secretbox(new TextEncoder().encode("checklistItem-title"), pkNonce, privateKey)
      ));
    });
  });
});
