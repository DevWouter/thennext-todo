/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, ComponentFixtureNoNgZone } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TasklistSettingsEncryptPanelComponent } from './tasklist-settings-encrypt-panel.component';
import { randomBytes, verify } from "tweetnacl";
import { encodeBase64, decodeBase64 } from "tweetnacl-util";
import { TaskListService } from '../../services';
import { IMock, Mock, Times, It } from 'typemoq';
import { TaskList, Task } from '../../models';
import { EncryptKeysStorageService, EncryptService } from '../../services/encrypt';


describe('TasklistSettingsEncryptPanelComponent', () => {
  let component: TasklistSettingsEncryptPanelComponent;
  let fixture: ComponentFixture<TasklistSettingsEncryptPanelComponent>;
  let listA: TaskList;
  let taskB: Task;
  let tasklistServiceMock: IMock<TaskListService>;
  let tasklistKeysServiceMock: IMock<EncryptKeysStorageService>;
  let encryptServiceMock: IMock<EncryptService>;

  beforeEach(async(() => {
    listA = <TaskList>{ uuid: "list-a", name: "List A" };
    tasklistServiceMock = Mock.ofType<TaskListService>();
    tasklistKeysServiceMock = Mock.ofType<EncryptKeysStorageService>();
    encryptServiceMock = Mock.ofType<EncryptService>();


    TestBed.configureTestingModule({
      declarations: [TasklistSettingsEncryptPanelComponent],
      providers: [
        { provide: TaskListService, useFactory: () => tasklistServiceMock.object },
        { provide: EncryptKeysStorageService, useFactory: () => tasklistKeysServiceMock.object },
        { provide: EncryptService, useFactory: () => encryptServiceMock.object },
      ]
    })
      .compileComponents();
  }));

  function setup() {
    encryptServiceMock.setup(x => x.validatePrivateKey(It.isAny())).returns(() => []);

    fixture = TestBed.createComponent(TasklistSettingsEncryptPanelComponent);
    component = fixture.componentInstance;
    component.tasklist = listA;
    fixture.detectChanges();
  }

  it('should exist', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should check if private key is verified on save', () => {
    const pk = randomBytes(32);
    const pk_string = encodeBase64(pk);
    encryptServiceMock.setup(x => x.validatePrivateKey(pk_string)).returns(() => ["WRONG_PK_ENCODING"]);
    setup();
    component.privateKeyString = pk_string;
    component.save();
    expect(() => encryptServiceMock.verify(x => x.validatePrivateKey(pk_string), Times.once())).not.toThrow();
  });

  it('should generate a valid private key when pressing "generate"', () => {
    setup();
    component.generatePrivateKey();
    expect(decodeBase64(component.privateKeyString).length).toBe(32);
  });

  it('should not encrypt the tasklist when validation fails', () => {
    const pk = randomBytes(32);
    const pk_string = encodeBase64(pk);
    encryptServiceMock.setup(x => x.validatePrivateKey(pk_string)).returns(() => ["WRONG_PK_ENCODING"]);
    setup();
    component.privateKeyString = pk_string;
    component.save();


    const expectedCall = encrypt_service => encrypt_service.encryptTaskList(
      It.is(input => verify(input, pk)),
      It.isValue(listA),
      [],
      []
    );

    expect(() => encryptServiceMock.verify(expectedCall, Times.never())).not.toThrow();
  });

  it('should encrypt the tasklist when validation succeeds', () => {
    const pk = randomBytes(32);
    const pk_string = encodeBase64(pk);
    setup();
    component.privateKeyString = pk_string;
    component.save();

    const expectedCall = encrypt_service => encrypt_service.encryptTaskList(
      It.is(input => verify(input, pk)),
      It.isValue(listA),
      [],
      []
    );

    expect(() => encryptServiceMock.verify(expectedCall, Times.once())).not.toThrow();
  });

  it('should encrypt the tasks associated with the tasklist');
  it('should encrypt the checklistItems associated with the tasklist');
  it('should show a message asking the person to download their private key after encrypting');
});
