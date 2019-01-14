/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SettingsPageMenuComponent } from './settings-page-menu.component';
import { MaterialModule } from '../../../material.module';
import { GuiModule } from '../../../gui/gui.module';
import { RouterTestingModule } from '@angular/router/testing';
import { IMock, Mock } from 'typemoq';
import { NavigationService, SessionService } from '../../../services';

describe('SettingsPageMenuComponent', () => {
  let component: SettingsPageMenuComponent;
  let fixture: ComponentFixture<SettingsPageMenuComponent>;

  let navigationServiceMock: IMock<NavigationService>;
  let sessionServiceMock: IMock<SessionService>;

  beforeEach(async(() => {

    navigationServiceMock = Mock.ofType<NavigationService>();
    sessionServiceMock = Mock.ofType<SessionService>();

    TestBed.configureTestingModule({
      declarations: [SettingsPageMenuComponent],
      providers: [
        { provide: NavigationService, useFactory: () => navigationServiceMock.object },
        { provide: SessionService, useFactory: () => sessionServiceMock.object },
      ],
      imports: [
        RouterTestingModule,
        MaterialModule,
        GuiModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPageMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
