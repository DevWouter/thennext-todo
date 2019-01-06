/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject, } from '@angular/core/testing';
import { RouterTestingModule, } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { Location } from "@angular/common";

import { CommonPageHeaderComponent } from './common-page-header.component';
import { MaterialModule } from '../../../material.module';
import { Router } from '@angular/router';

@Component({
  template: ''
})
class DummyComponent {
}

describe('CommonPageHeaderComponent', () => {
  let component: CommonPageHeaderComponent;
  let fixture: ComponentFixture<CommonPageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CommonPageHeaderComponent,
        DummyComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes(
          [
            { path: 'login', component: DummyComponent },
            { path: '', component: DummyComponent }
          ]
        ),
        MaterialModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should exist', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home page', async(inject([Router, Location],
    (router: Router, location: Location) => {
      const viewListButton = fixture.debugElement.query(By.css("[data-cy='header-home-button']"));
      viewListButton.triggerEventHandler("click", {});
      fixture.whenStable().then(() => {
        expect(location.path()).toBe("/");
      });
    }))
  );
  it('should navigate to home page', async(inject([Router, Location],
    (router: Router, location: Location) => {
      const viewListButton = fixture.debugElement.query(By.css("[data-cy='header-login-button']"));
      viewListButton.triggerEventHandler("click", {});
      fixture.whenStable().then(() => {
        expect(location.path()).toBe("/login");
      });
    }))
  );
});
