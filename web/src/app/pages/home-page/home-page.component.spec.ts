/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject, } from '@angular/core/testing';
import { RouterTestingModule, } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { Location } from "@angular/common";

import { HomePageComponent } from './home-page.component';
import { MaterialModule } from '../../material.module';
import { Router } from '@angular/router';

@Component({ template: '' })
class DummyComponent { }

@Component({ selector: 'app-common-page-header', template: '' })
class CommonPageHeaderStubComponent { }
@Component({ selector: 'app-common-page-footer', template: '' })
class CommonPageFooterStubComponent { }

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomePageComponent,
        DummyComponent,
        CommonPageHeaderStubComponent,
        CommonPageFooterStubComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes(
          [{ path: 'create-account', component: DummyComponent }]
        ),
        MaterialModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should exist', () => {
    expect(component).toBeTruthy();
  });

  it('should have a button to create an account back to task', async(inject([Router, Location], (router: Router, location: Location) => {
    const viewListButton = fixture.debugElement.query(By.css("[data-cy='create-account-button']"));
    viewListButton.triggerEventHandler("click", {});
    fixture.whenStable().then(() => {
      expect(location.path()).toBe("/create-account");
    });
  }))
  );
});
