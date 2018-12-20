import { randomBytes, secretbox } from "tweetnacl";
import { encodeBase64, decodeBase64 } from "tweetnacl-util";

import { EncryptTaskService } from './encrypt-task.service';
import { Task } from '../../models';


describe('Service: EncryptTask', () => {
  let task: Task;
  let service: EncryptTaskService;
  let pk: Uint8Array;
  beforeEach(() => {
    pk = randomBytes(32);
    task = <Task>{ title: "task-title", description: "task-description" };
    service = new EncryptTaskService();
  });

  it('should exist', () => {
    expect(service).toBeDefined();
  });

  it('should throw if encrypting a task that is already encrypted', () => {
    task.pkNonce = "fake-nonce";
    const act = () => service.encrypt(pk, task);
    expect(act).toThrowError("task already has pkNonce set and can not be encrypted again");
  });

  it('should add the nonce used for the task to the tasks', () => {
    service.encrypt(pk, task);
    expect(task.pkNonce).toBeDefined();
    expect(() => decodeBase64(task.pkNonce)).not.toThrow();
  })

  it('should encrypt the title of the task', () => {
    service.encrypt(pk, task);
    expect(task.title).toBe(encodeBase64(
      secretbox(new TextEncoder().encode("task-title"), decodeBase64(task.pkNonce), pk)
    ));
  });

  it('should encrypt the description of the task', () => {
    service.encrypt(pk, task);
    expect(task.description).toBe(encodeBase64(
      secretbox(new TextEncoder().encode("task-description"), decodeBase64(task.pkNonce), pk)
    ));
  });
});
