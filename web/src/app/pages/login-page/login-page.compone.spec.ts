/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from "@angular/common";

import { IMock, Mock, Times, It } from 'typemoq';

import { MaterialModule } from '../../material.module';

import { LoginPageComponent } from './login-page.component';
import { SessionService, TokenService } from '../../services';

@Component({ template: '' })
class DummyComponent { }
@Component({ selector: 'app-common-page-header', template: '' })
class CommonPageHeaderStubComponent { }
@Component({ selector: 'app-common-page-footer', template: '' })
class CommonPageFooterStubComponent { }

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let sessionServiceMock: IMock<SessionService>;
  let tokenServiceMock: IMock<TokenService>;

  beforeEach(async(() => {
    sessionServiceMock = Mock.ofType<SessionService>();
    tokenServiceMock = Mock.ofType<TokenService>();

    TestBed.configureTestingModule({
      declarations: [
        LoginPageComponent,
        DummyComponent,
        CommonPageHeaderStubComponent,
        CommonPageFooterStubComponent,
      ],
      providers: [
        { provide: SessionService, useFactory: () => sessionServiceMock.object },
        { provide: TokenService, useFactory: () => tokenServiceMock.object }
      ],
      imports: [
        RouterTestingModule.withRoutes(
          [{ path: 'forget-password', component: DummyComponent }]
        ),
        FormsModule,
        MaterialModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should exist', async(inject([Router, Location], (router: Router, location: Location) => {
    expect(component).toBeDefined();
  })));

  it('should show a mesasge when login fails');
  it('should block the login button when trying to process the request');
  it('should trigger login when pressing enter in password-field');
  it('should trigger login when pressing enter in username-field');
  fit('should have a link to reset password in case you forgot', async(inject([Router, Location], (router: Router, location: Location) => {
    const element = fixture.debugElement.query(By.css("[data-cy='forgot-password-link']"));
    (element.nativeElement as HTMLElement).click();
    fixture.whenStable().then(() => {
      expect(location.path()).toBe("/forget-password");
    });
  })));
});
