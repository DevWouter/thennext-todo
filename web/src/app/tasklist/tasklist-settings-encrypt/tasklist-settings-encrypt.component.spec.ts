/* tslint:disable:no-unused-variable */
import { Mock, IMock } from 'typemoq';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { TasklistSettingsEncryptComponent } from './tasklist-settings-encrypt.component';
import { TaskList } from '../../models';

import * as nacl from "tweetnacl";
import { encodeBase64 } from "tweetnacl-util";
import { TaskListService, TaskService, ChecklistItemService } from '../../services';

import { TasklistSettingsEncryptPanelComponent } from '../tasklist-settings-encrypt-panel/tasklist-settings-encrypt-panel.component';
import { TasklistSettingsDecryptPanelComponent } from '../tasklist-settings-decrypt-panel/tasklist-settings-decrypt-panel.component';
import { TasklistSettingsKeyinputPanelComponent } from '../tasklist-settings-keyinput-panel/tasklist-settings-keyinput-panel.component';
import { Type, Predicate, DebugElement } from '@angular/core';
import { EncryptKeysStorageService, TasklistPrivateKey } from '../../services/encrypt';

const dummyPrivateKey = nacl.randomBytes(32);
const dummyPrivateKeyHash = nacl.hash(dummyPrivateKey);
const dummyPrivateKeyHashString = encodeBase64(dummyPrivateKeyHash);

const encryptPanel = By.directive(TasklistSettingsEncryptPanelComponent);
const keyInputPanel = By.directive(TasklistSettingsKeyinputPanelComponent);
const decryptPanel = By.directive(TasklistSettingsDecryptPanelComponent);

describe('TasklistSettingsEncryptComponent', () => {
  let component: TasklistSettingsEncryptComponent;
  let fixture: ComponentFixture<TasklistSettingsEncryptComponent>;
  let tasklist: TaskList;
  let tasklistKeysServiceMock: IMock<EncryptKeysStorageService>;
  let taskListServiceMock: IMock<TaskListService>;
  let taskServiceMock: IMock<TaskService>;
  let checklistItemServiceMock: IMock<ChecklistItemService>;
  let privateKeys: BehaviorSubject<TasklistPrivateKey[]>;

  beforeEach(async(() => {
    privateKeys = new BehaviorSubject<TasklistPrivateKey[]>([]);
    tasklist = <TaskList>{ uuid: "list-a" };
    tasklistKeysServiceMock = Mock.ofType<EncryptKeysStorageService>();
    taskListServiceMock = Mock.ofType<TaskListService>();
    taskServiceMock = Mock.ofType<TaskService>();
    checklistItemServiceMock = Mock.ofType<ChecklistItemService>();
    tasklistKeysServiceMock.setup(x => x.privateKeys).returns(() => privateKeys);

    TestBed.configureTestingModule({
      declarations: [
        TasklistSettingsEncryptComponent,
        TasklistSettingsEncryptPanelComponent,
        TasklistSettingsDecryptPanelComponent,
        TasklistSettingsKeyinputPanelComponent,
      ],
      providers: [
        { provide: EncryptKeysStorageService, useFactory: () => tasklistKeysServiceMock.object },
        { provide: TaskListService, useFactory: () => taskListServiceMock.object },
        { provide: TaskService, useFactory: () => taskServiceMock.object },
        { provide: ChecklistItemService, useFactory: () => checklistItemServiceMock.object },
      ]
    }).compileComponents();
  }));

  function setup() {
    fixture = TestBed.createComponent(TasklistSettingsEncryptComponent);
    component = fixture.componentInstance;
    component.tasklist = tasklist;
    component.allowEncryption = true;
    fixture.detectChanges();
  }

  function getComponent<T>(predicate: Predicate<DebugElement>, type: Type<T>): T {
    return fixture.debugElement.query(predicate).injector.get<T>(type);
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should not show the encryption panel unless enabled', () => {
    setup();
    component.allowEncryption = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(encryptPanel)).toBeNull("since encryption is not allowed");
    expect(fixture.debugElement.query(keyInputPanel)).toBeNull("since encryption is not allowed");
    expect(fixture.debugElement.query(decryptPanel)).toBeNull("since encryption is not allowed");

  });

  it('should pass the tasklist to encryptPanel', () => {
    setup();
    const component = getComponent(encryptPanel, TasklistSettingsEncryptPanelComponent);
    expect(component.tasklist).toBe(tasklist);
  });

  it('should pass the tasklist to keyinputPanel', () => {
    tasklist.privateKeyHash = dummyPrivateKeyHashString;
    setup();
    const component = getComponent(keyInputPanel, TasklistSettingsKeyinputPanelComponent);
    expect(component.tasklist).toBe(tasklist);
  });

  it('should pass the tasklist to decryptPanel', () => {
    tasklist.privateKeyHash = dummyPrivateKeyHashString;
    privateKeys.next([{
      privateKey: dummyPrivateKey,
      tasklistGuid: "list-a"
    }]);
    setup();
    const component = getComponent(decryptPanel, TasklistSettingsDecryptPanelComponent);
    expect(component.tasklist).toBe(tasklist);
  });

  it('should show a option to encrypt a tasklist if unencrypted', (done) => {
    setup();

    expect(fixture.debugElement.query(encryptPanel)).toBeTruthy("since the tasklist is not encrypted, so show encrypt options");
    expect(fixture.debugElement.query(keyInputPanel)).toBeNull("since the tasklist is not encrypted, so show no key input is required");
    expect(fixture.debugElement.query(decryptPanel)).toBeNull("since the tasklist is not encrypted, so show no decrypt options");

    component.$panel.pipe(take(1)).subscribe(x => {
      expect(x).toBe("encrypt");
      done();
    });
  });

  it('should show key input if encrypted and private key is not known', (done) => {
    tasklist.privateKeyHash = dummyPrivateKeyHashString;
    setup();

    expect(fixture.debugElement.query(encryptPanel)).toBeNull("since the tasklist is encrypted, so show no encrypt options");
    expect(fixture.debugElement.query(keyInputPanel)).toBeTruthy("since the tasklist is encrypted but key is still unknown, so key input is required");
    expect(fixture.debugElement.query(decryptPanel)).toBeNull("since the tasklist is encrypted, but decrypt key is unknown, so no decrypt options");

    component.$panel.pipe(take(1)).subscribe(x => {
      expect(x).toBe("key-input");
      done();
    });

  });

  it('should show a option to decrypt a tasklist if encrypted and private key is known', (done) => {
    tasklist.privateKeyHash = dummyPrivateKeyHashString;
    privateKeys.next([{
      privateKey: dummyPrivateKey,
      tasklistGuid: "list-a"
    }]);

    setup();

    expect(fixture.debugElement.query(encryptPanel)).toBeNull("since the tasklist is encrypted, so show no encrypt options");
    expect(fixture.debugElement.query(keyInputPanel)).toBeNull("since the tasklist is encrypted and PK is known, so no key input is required");
    expect(fixture.debugElement.query(decryptPanel)).toBeTruthy("since the tasklist is encrypted, but PK is known, so show decrypt options");

    component.$panel.pipe(take(1)).subscribe(x => {
      expect(x).toBe("decrypt");
      done();
    });
  });
});
