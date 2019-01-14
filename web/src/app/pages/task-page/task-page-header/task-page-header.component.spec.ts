/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TaskPageHeaderComponent } from './task-page-header.component';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContextService, NavigationService, TaskListService } from '../../../services';
import { IMock, Mock, It, Times } from 'typemoq';
import { TaskList } from '../../../models';
import { of } from 'rxjs';

describe('TaskPageHeaderComponent', () => {
  let component: TaskPageHeaderComponent;
  let fixture: ComponentFixture<TaskPageHeaderComponent>;

  let taskListServiceMock: IMock<TaskListService>;
  let navigationMock: IMock<NavigationService>;
  let contextServiceMock: IMock<ContextService>;

  let tasklists: TaskList[];
  let activeTasklist: TaskList;

  beforeEach(async(() => {
    navigationMock = Mock.ofType<NavigationService>();

    taskListServiceMock = Mock.ofType<TaskListService>();
    taskListServiceMock.setup(x => x.entries).returns(() => of<TaskList[]>([]));
    contextServiceMock = Mock.ofType<ContextService>();
    contextServiceMock.setup(x => x.activeTaskList).returns(() => of<TaskList>(undefined));

    TestBed.configureTestingModule({
      declarations: [TaskPageHeaderComponent,],
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: TaskListService, useFactory: () => taskListServiceMock.object },
        { provide: NavigationService, useFactory: () => navigationMock.object },
        { provide: ContextService, useFactory: () => contextServiceMock.object },
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
