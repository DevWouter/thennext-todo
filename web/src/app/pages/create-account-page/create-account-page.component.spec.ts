/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject, } from '@angular/core/testing';
import { RouterTestingModule, } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, NgZone } from '@angular/core';
import { Location } from "@angular/common";

import { IMock, Mock, Times, It } from 'typemoq';

import { CreateAccountPageComponent } from './create-account-page.component';
import { MaterialModule } from '../../material.module';
import { Router } from '@angular/router';
import { AccountService } from '../../services';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({ template: '' })
class DummyComponent { }

@Component({ selector: 'app-common-page-header', template: '' })
class CommonPageHeaderStubComponent { }
@Component({ selector: 'app-common-page-footer', template: '' })
class CommonPageFooterStubComponent { }

describe('CreateAccountPageComponent', () => {
  let component: CreateAccountPageComponent;
  let fixture: ComponentFixture<CreateAccountPageComponent>;
  let accountServiceMock: IMock<AccountService>;

  let clickSubmit: () => void;
  let setUser: (username: string, password: string) => void;

  beforeEach(async(() => {
    accountServiceMock = Mock.ofType<AccountService>();

    TestBed.configureTestingModule({
      declarations: [
        CreateAccountPageComponent,
        DummyComponent,
        CommonPageHeaderStubComponent,
        CommonPageFooterStubComponent,
      ],
      providers: [
        { provide: AccountService, useFactory: () => accountServiceMock.object },
      ],
      imports: [
        RouterTestingModule.withRoutes(
          [{ path: "account-created", component: DummyComponent }]
        ),
        MaterialModule,
        FormsModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    clickSubmit = () => {
      (fixture.debugElement.query(By.css(`[data-cy="submit"]`)).nativeElement as HTMLButtonElement).click();
      fixture.detectChanges();
    }
  });

  it('should exist', () => {
    expect(component).toBeTruthy();
  });

  it('should have unlocked the submitted button from the beginning', () => {
    expect(component.working).toBeFalsy();
  });

  it('should have an input field mapped to username', () => {
    const debugElement = fixture.debugElement.query(By.css(`[data-cy="username"]`));
    (debugElement.nativeElement as HTMLInputElement).value = "TEST_USERNAME";
    (debugElement.nativeElement as HTMLInputElement).dispatchEvent(new Event('input'));
    expect(component.username).toBe("TEST_USERNAME");
  });
  it('should have an input field mapped to pasword', () => {
    const debugElement = fixture.debugElement.query(By.css(`[data-cy="password"]`));
    (debugElement.nativeElement as HTMLInputElement).value = "TEST_PASSWORD";
    (debugElement.nativeElement as HTMLInputElement).dispatchEvent(new Event('input'));
    expect(component.password).toBe("TEST_PASSWORD");
  });

  it('should send the username to accountServiceMock', () => {
    component.username = "Wouter";
    clickSubmit();

    const chk = () => accountServiceMock.verify(x => x.createAccount(It.isValue("Wouter"), It.isAnyString()), Times.once());
    expect(chk).not.toThrow();
  });

  it('should send the password to accountServiceMock', () => {
    component.password = "FAKE_PASSWORD";
    clickSubmit();

    const chk = () => accountServiceMock.verify(x => x.createAccount(It.isAnyString(), It.isValue("FAKE_PASSWORD")), Times.once());
    expect(chk).not.toThrow();
  });

  it('should navigate to `/account-created` on success', async(inject([Router, Location], (router: Router, location: Location) => {
    const obs = new Subject<{ uuid: string; email: string; }>();
    accountServiceMock.setup(x => x.createAccount(It.isAny(), It.isAny())).returns(() => obs.toPromise());
    clickSubmit();
    obs.next({ email: "", uuid: "" });
    obs.complete();
    fixture.whenStable().then(() => {
      expect(location.path()).toBe("/account-created");
    });
  })));

  it('should lock the submit button is pressed', () => {
    const obs = new Subject<{ uuid: string; email: string; }>();
    accountServiceMock.setup(x => x.createAccount(It.isAny(), It.isAny())).returns(() => obs.toPromise());

    clickSubmit();
    expect(this.working).toBeFalsy();
    obs.next(undefined);
    obs.complete();
  });

  it('should unlock the submit button when no result is returned', () => {
    accountServiceMock.setup(x => x.createAccount(It.isAny(), It.isAny())).returns(() => Promise.resolve(undefined));

    clickSubmit();

    expect(this.working).toBeFalsy();
  });
});
