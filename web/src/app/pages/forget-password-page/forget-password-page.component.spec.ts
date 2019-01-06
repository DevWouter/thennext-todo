/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject, } from '@angular/core/testing';
import { RouterTestingModule, } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { Location } from "@angular/common";

import { IMock, Mock, Times, It } from 'typemoq';

import { ForgetPasswordPageComponent } from './forget-password-page.component';
import { MaterialModule } from '../../material.module';
import { Router } from '@angular/router';
import { AccountService } from '../../services';
import { FormsModule } from '@angular/forms';

@Component({ template: '' })
class DummyComponent { }

@Component({ selector: 'app-common-page-header', template: '' })
class CommonPageHeaderStubComponent { }
@Component({ selector: 'app-common-page-footer', template: '' })
class CommonPageFooterStubComponent { }

describe('ForgetPasswordPageComponent', () => {
  let component: ForgetPasswordPageComponent;
  let fixture: ComponentFixture<ForgetPasswordPageComponent>;
  let accountServiceMock: IMock<AccountService>;

  beforeEach(async(() => {
    accountServiceMock = Mock.ofType<AccountService>();

    TestBed.configureTestingModule({
      declarations: [
        ForgetPasswordPageComponent,
        DummyComponent,
        CommonPageHeaderStubComponent,
        CommonPageFooterStubComponent,
      ],
      providers: [
        { provide: AccountService, useFactory: () => accountServiceMock.object },
      ],
      imports: [
        RouterTestingModule.withRoutes(
          []
        ),
        MaterialModule,
        FormsModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetPasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should exist', () => {
    expect(component).toBeTruthy();
  });
});
