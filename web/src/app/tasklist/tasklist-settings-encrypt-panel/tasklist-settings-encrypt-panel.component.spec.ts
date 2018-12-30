/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, ComponentFixtureNoNgZone } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TasklistSettingsEncryptPanelComponent } from './tasklist-settings-encrypt-panel.component';
import { randomBytes, verify } from "tweetnacl";
import { encodeBase64, decodeBase64 } from "tweetnacl-util";
import { TaskListService, TaskService, ChecklistItemService } from '../../services';
import { IMock, Mock, Times, It } from 'typemoq';
import { TaskList, Task, ChecklistItem } from '../../models';
import { EncryptKeysStorageService, EncryptService } from '../../services/encrypt';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { detectChanges } from '@angular/core/src/render3';


describe('TasklistSettingsEncryptPanelComponent', () => {
  let component: TasklistSettingsEncryptPanelComponent;
  let fixture: ComponentFixture<TasklistSettingsEncryptPanelComponent>;

  let listA: TaskList;

  let taskA: Task;
  let taskB: Task;

  let itemA: ChecklistItem;
  let itemB: ChecklistItem;

  let $lists: BehaviorSubject<TaskList[]>;
  let $tasks: BehaviorSubject<Task[]>;
  let $items: BehaviorSubject<ChecklistItem[]>;

  let tasklistServiceMock: IMock<TaskListService>;
  let tasklistKeysServiceMock: IMock<EncryptKeysStorageService>;
  let encryptServiceMock: IMock<EncryptService>;
  let checklistItemServiceMock: IMock<ChecklistItemService>;
  let taskServiceMock: IMock<TaskService>;

  beforeEach(async(() => {
    listA = <TaskList>{ uuid: "list-a", name: "List A" };

    taskA = <Task>{ uuid: "task-a", taskListUuid: "list-a" };
    taskB = <Task>{ uuid: "task-b", taskListUuid: "list-b" };

    itemA = <ChecklistItem>{ uuid: "item-a", taskUuid: "task-a" };
    itemB = <ChecklistItem>{ uuid: "item-b", taskUuid: "task-b" };

    $lists = new BehaviorSubject([]);
    $tasks = new BehaviorSubject([]);
    $items = new BehaviorSubject([]);

    tasklistServiceMock = Mock.ofType<TaskListService>();
    taskServiceMock = Mock.ofType<TaskService>();
    checklistItemServiceMock = Mock.ofType<ChecklistItemService>();

    encryptServiceMock = Mock.ofType<EncryptService>();

    TestBed.configureTestingModule({
      declarations: [TasklistSettingsEncryptPanelComponent],
      providers: [
        { provide: TaskListService, useFactory: () => tasklistServiceMock.object },
        { provide: EncryptKeysStorageService, useFactory: () => tasklistKeysServiceMock.object },
        { provide: EncryptService, useFactory: () => encryptServiceMock.object },
        { provide: TaskService, useFactory: () => taskServiceMock.object },
        { provide: ChecklistItemService, useFactory: () => checklistItemServiceMock.object },
      ]
    })
      .compileComponents();
  }));

  function setup() {
    tasklistServiceMock.setup(x => x.entries).returns(() => $lists);
    taskServiceMock.setup(x => x.entries).returns(() => $tasks);
    checklistItemServiceMock.setup(x => x.entries).returns(() => $items);

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

  it('should check if private key is verified on save', (done) => {
    const pk = randomBytes(32);
    const pk_string = encodeBase64(pk);
    encryptServiceMock.setup(x => x.validatePrivateKey(pk_string)).returns(() => ["WRONG_PK_ENCODING"]);
    setup();
    component.privateKeyString = pk_string;
    component.getEncrypted().subscribe({
      error() {
        expect(() => encryptServiceMock.verify(x => x.validatePrivateKey(pk_string), Times.once())).not.toThrow();
        done();
      },
    });
  });

  it('should generate a valid private key when pressing "generate"', () => {
    setup();
    component.generatePrivateKey();
    expect(decodeBase64(component.privateKeyString).length).toBe(32);
  });

  it('should not encrypt the tasklist when validation fails', (done) => {
    const pk = randomBytes(32);
    const pk_string = encodeBase64(pk);
    encryptServiceMock.setup(x => x.validatePrivateKey(pk_string)).returns(() => ["WRONG_PK_ENCODING"]);
    setup();
    component.privateKeyString = pk_string;
    component.getEncrypted().subscribe({
      error() {
        const expectedCall = encrypt_service => encrypt_service.encryptTaskList(
          It.is(input => verify(input, pk)),
          It.isValue(listA),
          It.isAny(),
          It.isAny()
        );

        expect(() => encryptServiceMock.verify(expectedCall, Times.never())).not.toThrow();

        done();
      }
    });
  });

  it('should encrypt the tasklist when validation succeeds', (done) => {
    const pk = randomBytes(32);
    const pk_string = encodeBase64(pk);
    $tasks = new BehaviorSubject([taskA, taskB]);
    setup();
    component.privateKeyString = pk_string;
    component.getEncrypted().subscribe(undefined, undefined, () => {
      const expectedCall = encrypt_service => encrypt_service.encryptTaskList(
        It.is(input => verify(input, pk)),
        It.isValue(listA),
        It.isAny(),
        It.isAny()
      );

      expect(() => encryptServiceMock.verify(expectedCall, Times.once())).not.toThrow();
      done();
    });
  });

  it('should provide the encrypt-function with tasks associated with the tasklist', (done) => {
    const pk = randomBytes(32);
    const pk_string = encodeBase64(pk);
    $tasks = new BehaviorSubject([taskA]);
    setup();
    component.privateKeyString = pk_string;
    component.getEncrypted().subscribe(() => {
      const expectedCall = (encrypt_service: EncryptService) => encrypt_service.encryptTaskList(
        It.isAny(),
        It.isAny(),
        It.is((v: Task[]) => !!v.find(x => x.uuid === taskA.uuid)),
        It.isAny()
      );
      expect(() => encryptServiceMock.verify(expectedCall, Times.once())).not.toThrow();
      done();
    });
  });

  it('should provide the encrypt-function with checklistItems associated with the tasklist', (done) => {
    const pk = randomBytes(32);
    const pk_string = encodeBase64(pk);
    $tasks = new BehaviorSubject([taskA]);
    $items = new BehaviorSubject([itemA]);
    setup();
    component.privateKeyString = pk_string;
    component.getEncrypted().subscribe(() => {
      const expectedCall = (encrypt_service: EncryptService) => encrypt_service.encryptTaskList(
        It.isAny(),
        It.isAny(),
        It.isAny(),
        It.is(v => !!v.find(x => x.uuid === itemA.uuid))
      );
      expect(() => encryptServiceMock.verify(expectedCall, Times.once())).not.toThrow();
      done();
    });
  });

  it('should not provide the encrypt-function with tasks associated with other tasklists', (done) => {
    const pk = randomBytes(32);
    const pk_string = encodeBase64(pk);
    $tasks = new BehaviorSubject([taskA, taskB]);
    setup();
    component.privateKeyString = pk_string;
    component.getEncrypted().subscribe(() => {
      const expectedCall = (encrypt_service: EncryptService) => encrypt_service.encryptTaskList(
        It.isAny(),
        It.isAny(),
        It.is((v: Task[]) => !v.find(x => x.uuid === taskB.uuid)),
        It.isAny()
      );
      expect(() => encryptServiceMock.verify(expectedCall, Times.once())).not.toThrow();
      done();
    });
  });

  it('should not provide the encrypt-function with checklistItems associated with other tasklists', (done) => {
    const pk = randomBytes(32);
    const pk_string = encodeBase64(pk);
    $tasks = new BehaviorSubject([taskA, taskB]);
    $items = new BehaviorSubject([itemA, itemB]);
    setup();
    component.privateKeyString = pk_string;
    component.getEncrypted().subscribe(() => {
      const expectedCall = (encrypt_service: EncryptService) => encrypt_service.encryptTaskList(
        It.isAny(),
        It.isAny(),
        It.isAny(),
        It.is(v => v.find(x => x.uuid === itemB.uuid) === undefined),
      );
      expect(() => encryptServiceMock.verify(expectedCall, Times.once())).not.toThrow();
      done();
    });
  });

  it('should call the encrypt function when the save button is clicked', () => {
    const pk = randomBytes(32);
    const pk_string = encodeBase64(pk);
    setup();
    component.privateKeyString = pk_string;
    (fixture.debugElement.query(By.css('[cy-data="save"]')).nativeElement as HTMLElement).click();

    expect(() => encryptServiceMock.verify(s => s.encryptTaskList(It.isAny(), It.isAny(), It.isAny(), It.isAny()), Times.once())).not.toThrow();
  });

  it('should not show a message asking to store their private key unless it was just encrypted', () => {
    setup();
    expect(fixture.debugElement.query(By.css('[cy-data="pk-message"]'))).toBeNull();
  });

  it('should show a message asking the person to store their private key after encrypting', (done) => {
    const getSaveButton = () => fixture.debugElement.query(By.css('[cy-data="save"]')).nativeElement as HTMLElement;
    const getShowPrivateKeyMessage = () => fixture.debugElement.query(By.css('[cy-data="pk-message"]')).nativeElement as HTMLElement;

    const pk = randomBytes(32);
    const pk_string = encodeBase64(pk);
    setup();
    component.privateKeyString = pk_string;
    fixture.detectChanges();
    getSaveButton().click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(getShowPrivateKeyMessage().innerText).toContain(pk_string);
      done();
    });

  });
});
