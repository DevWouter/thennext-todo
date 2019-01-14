/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IMock, Mock } from 'typemoq';
import { of } from 'rxjs';

import { TaskPageMenuComponent } from './task-page-menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../material.module';
import { FormsModule } from '@angular/forms';
import { GuiModule } from '../../../gui/gui.module';
import { SessionService, NavigationService } from '../../../services';

describe('TaskPageMenuComponent', () => {
  let component: TaskPageMenuComponent;
  let fixture: ComponentFixture<TaskPageMenuComponent>;
  let sessionServiceMock: IMock<SessionService>;
  let navigationServiceMock: IMock<NavigationService>;

  beforeEach(async(() => {
    sessionServiceMock = Mock.ofType<SessionService>();
    navigationServiceMock = Mock.ofType<NavigationService>();

    navigationServiceMock.setup(x => x.showCompleted).returns(() => of(false));
    navigationServiceMock.setup(x => x.showBlocked).returns(() => of(false));
    navigationServiceMock.setup(x => x.showNegative).returns(() => of(false));

    TestBed.configureTestingModule({
      declarations: [TaskPageMenuComponent],
      providers: [
        { provide: SessionService, useFactory: () => sessionServiceMock.object },
        { provide: NavigationService, useFactory: () => navigationServiceMock.object },
      ],
      imports: [
        RouterTestingModule,
        MaterialModule,
        FormsModule,
        GuiModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPageMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
