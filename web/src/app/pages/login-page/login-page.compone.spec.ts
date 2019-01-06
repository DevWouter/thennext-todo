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
import { Session } from '../../models';
import { Subject } from 'rxjs';

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

  let sessionResult: Subject<Session>;

  beforeEach(async(() => {
    sessionServiceMock = Mock.ofType<SessionService>();
    tokenServiceMock = Mock.ofType<TokenService>();
    sessionResult = new Subject<Session>();

    sessionServiceMock.setup(x => x
      .createSession(It.isValue("valid@test.com"), It.isAnyString()))
      .returns(() => Promise.resolve(<Session>{ token: "test-token" }));

    sessionServiceMock.setup(x => x
      .createSession(It.isValue("delay@test.com"), It.isAnyString()))
      .returns(() => sessionResult.toPromise());

    sessionServiceMock.setup(x => x
      .createSession(It.isAnyString(), It.isAnyString()))
      .returns(() => Promise.reject("Generic error"));

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
          [
            { path: 'forget-password', component: DummyComponent },
            { path: 'tasks', component: DummyComponent },
          ]
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


  it('should show the logout reason if provided', async(inject([Router, Location], (router: Router, location: Location) => {
    component.loginReason = "my-logout-reason";
    fixture.detectChanges();
    fixture.whenStable().then(()=>{
      expect((fixture.debugElement.nativeElement as HTMLInputElement).textContent).toContain("my-logout-reason");
    });

    expect(component).toBeDefined();
  })));

  it('should show a message when login fails', async(inject([Router, Location], (router: Router, location: Location) => {
    const element = fixture.debugElement.query(By.css("[data-cy='submit']"));
    element.triggerEventHandler("click", {});
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const errorElement = fixture.debugElement.query(By.css(".row--error"));
      expect(errorElement).toBeTruthy();
      expect((errorElement.nativeElement as HTMLElement).textContent).toContain("error");
    });
  })));

  it('should block the login button when trying to process the request', async(inject([Router, Location], (router: Router, location: Location) => {
    const usernameElement = fixture.debugElement.query(By.css("[data-cy='username']"));
    (usernameElement.nativeElement as HTMLInputElement).value = "delay@test.com";
    (usernameElement.nativeElement as HTMLInputElement).dispatchEvent(new Event("input"));
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css("[data-cy='submit']"));
    element.triggerEventHandler("click", {});
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect((element.nativeElement as HTMLButtonElement).disabled).toBeTruthy();
    });
  })));

  it('should navigate to tasks-page on valid login', async(inject([Router, Location], (router: Router, location: Location) => {
    const usernameElement = fixture.debugElement.query(By.css("[data-cy='username']"));
    (usernameElement.nativeElement as HTMLInputElement).value = "valid@test.com";
    (usernameElement.nativeElement as HTMLInputElement).dispatchEvent(new Event("input"));
    const passwordElement = fixture.debugElement.query(By.css("[data-cy='password']"));
    (passwordElement.nativeElement as HTMLInputElement).value = "password";
    (passwordElement.nativeElement as HTMLInputElement).dispatchEvent(new Event("input"));
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css("[data-cy='submit']"));
    element.triggerEventHandler("click", {});
    fixture.whenStable().then(() => {
      expect(location.path()).toBe("/tasks");
    });
  })));

  it('should trigger login when clicking the login button', async(inject([Router, Location], (router: Router, location: Location) => {
    const usernameElement = fixture.debugElement.query(By.css("[data-cy='username']"));
    (usernameElement.nativeElement as HTMLInputElement).value = "username";
    (usernameElement.nativeElement as HTMLInputElement).dispatchEvent(new Event("input"));
    const passwordElement = fixture.debugElement.query(By.css("[data-cy='password']"));
    (passwordElement.nativeElement as HTMLInputElement).value = "password";
    (passwordElement.nativeElement as HTMLInputElement).dispatchEvent(new Event("input"));
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css("[data-cy='submit']"));
    element.triggerEventHandler("click", {});
    fixture.whenStable().then(() => {
      var f = () => sessionServiceMock.verify(x => x.createSession(It.isValue("username"), It.isValue("password")), Times.once());
      expect(f).not.toThrow();
    });
  })));

  it('should trigger login when pressing enter in password-field', async(inject([Router, Location], (router: Router, location: Location) => {
    const element = fixture.debugElement.query(By.css("[data-cy='password']"));
    element.triggerEventHandler("keydown.enter", {});
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      var f = () => sessionServiceMock.verify(x => x.createSession(It.isAnyString(), It.isAnyString()), Times.once());
      expect(f).not.toThrow();
    });
  })));

  it('should trigger login when pressing enter in username-field', async(inject([Router, Location], (router: Router, location: Location) => {
    const element = fixture.debugElement.query(By.css("[data-cy='username']"));
    element.triggerEventHandler("keydown.enter", {});
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      var f = () => sessionServiceMock.verify(x => x.createSession(It.isAnyString(), It.isAnyString()), Times.once());
      expect(f).not.toThrow();
    });
  })));

  it('should have a link to reset password in case you forgot', async(inject([Router, Location], (router: Router, location: Location) => {
    const element = fixture.debugElement.query(By.css("[data-cy='forgot-password-link']"));
    (element.nativeElement as HTMLElement).click();
    fixture.whenStable().then(() => {
      expect(location.path()).toBe("/forget-password");
    });
  })));
});
