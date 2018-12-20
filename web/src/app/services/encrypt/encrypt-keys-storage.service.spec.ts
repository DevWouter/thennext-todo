import { take, skip } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Mock, IMock, Times } from 'typemoq';


import * as nacl from "tweetnacl";
import { encodeBase64 } from "tweetnacl-util";
import { TaskList } from '../../models';
import { StorageService } from '../storage.service';
import { TasklistEventService } from '../tasklist';
import { EncryptKeysStorageService } from './encrypt-keys-storage.service';

const privateKeyA = nacl.randomBytes(32);
const privateKeyB = nacl.randomBytes(32);
const tasklistGuidA = "list-a";
const tasklistGuidB = "list-b";

describe('Service: EncryptKeysStorage', () => {
  let service: EncryptKeysStorageService;
  let deletedTasklist: Subject<TaskList>;
  let storageServiceMock: IMock<StorageService>;
  let tasklistEventServiceMock: IMock<TasklistEventService>;

  beforeEach(() => {
    localStorage.clear(); // Clear localstorage.

    deletedTasklist = new Subject<TaskList>();
    tasklistEventServiceMock = Mock.ofType<TasklistEventService>();
    storageServiceMock = Mock.ofType<StorageService>();
    tasklistEventServiceMock.setup(x => x.deletedTasklist).returns(() => deletedTasklist);
  });

  function setup() {
    service = new EncryptKeysStorageService(
      tasklistEventServiceMock.object,
      storageServiceMock.object
    );
  }

  it('should exist', () => {
    setup();
    expect(service).toBeTruthy();
  });

  it('should have an empty list of keys', (done) => {
    setup();
    service.privateKeys
      .pipe(take(1))
      .subscribe(keys => {
        expect(keys.length).toBe(0);
        done();
      });
  });

  it('should update the list of private keys when adding one', (done) => {
    setup();
    service.privateKeys
      .pipe(skip(1), take(1))
      .subscribe(keys => {
        expect(keys.length).toBe(1);
        const key = keys[0];
        expect(key.tasklistGuid).toBe(tasklistGuidA);
        expect(key.privateKey).toBe(privateKeyA);
        done();
      });

    service.set(tasklistGuidA, privateKeyA);
  });

  it('should update the list of private keys when remove one', (done) => {
    setup();
    service.privateKeys
      .pipe(skip(2), take(1))
      .subscribe(keys => {
        expect(keys.length).toBe(0, "since we removed the keys");
        done();
      });

    service.set(tasklistGuidA, privateKeyA);
    service.unset(tasklistGuidA);
  });

  it('should update the private key when set is called twice', (done) => {
    setup();
    service.privateKeys
      .pipe(skip(2), take(1))
      .subscribe(keys => {
        expect(keys.length).toBe(1);
        const key = keys[0];
        expect(key.tasklistGuid).toBe(tasklistGuidA);
        expect(key.privateKey).toBe(privateKeyB, "since we updated it to the other one");
        done();
      });

    service.set(tasklistGuidA, privateKeyA);
    service.set(tasklistGuidA, privateKeyB);
  });

  it('should ignore an unset if the key is missing', (done) => {
    setup();
    service.set(tasklistGuidA, privateKeyA);
    service.unset(tasklistGuidB);

    service.privateKeys
      .pipe(take(1))
      .subscribe(keys => {
        expect(keys.length).toBe(1);
        done();
      });
  });

  it('should load the keys from localstorage', (done) => {
    var stored_keys_json = JSON.stringify([{
      privateKey: encodeBase64(privateKeyA),
      tasklistGuid: tasklistGuidA,
    }]);
    storageServiceMock.setup(x => x.get("tasklist-private-keys")).returns(() => stored_keys_json);
    setup();

    service.privateKeys.pipe(take(1))
      .subscribe(keys => {
        expect(keys.length).toBe(1);
        const key = keys[0];
        expect(key.tasklistGuid).toBe(tasklistGuidA);
        expect(encodeBase64(key.privateKey)).toBe(encodeBase64(privateKeyA));
        done();
      });
  });

  it('should save everytime a key is set', () => {
    var stored_keys_json = JSON.stringify([{
      privateKey: encodeBase64(privateKeyA),
      tasklistGuid: tasklistGuidA,
    }]);

    setup();

    service.set(tasklistGuidA, privateKeyA);
    expect(() => storageServiceMock.verify(x => x.set("tasklist-private-keys", stored_keys_json), Times.once())).not.toThrow();
  });

  it('should save everytime a key is unset', () => {
    var stored_keys_json = JSON.stringify([]);

    setup();
    service.set(tasklistGuidA, privateKeyA);
    storageServiceMock.reset();
    service.unset(tasklistGuidA);
    expect(() => storageServiceMock.verify(x => x.set("tasklist-private-keys", stored_keys_json), Times.once())).not.toThrow();
  });

  it('should clear the keys if loading from localstorage fails', () => {
    storageServiceMock.setup(x => x.get("tasklist-private-keys")).returns(() => "illegal_json");
    setup();

    expect(() => storageServiceMock.verify(x => x.del("tasklist-private-keys"), Times.once())).not.toThrow();
  });

  it('should update the list if known list is removed', (done) => {
    setup();
    service.privateKeys
      .pipe(skip(2), take(1))
      .subscribe(keys => {
        expect(keys.length).toBe(0, "since a delete event has occured");
        done();
      });

    service.set(tasklistGuidA, privateKeyA);
    deletedTasklist.next(<TaskList>{
      uuid: tasklistGuidA
    });
  });
});
