/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject, } from '@angular/core/testing';
import { RouterTestingModule, } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { Location } from "@angular/common";

import { SchedulePageComponent } from './schedule-page.component';
import { MaterialModule } from '../../material.module';
import { Router } from '@angular/router';

@Component({
  template: ''
})
class DummyComponent {
}

describe('SchedulePageComponent', () => {
  let component: SchedulePageComponent;
  let fixture: ComponentFixture<SchedulePageComponent>;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SchedulePageComponent, DummyComponent],
      imports: [
        RouterTestingModule.withRoutes(
          [{ path: 'tasks', component: DummyComponent }]
        ),
        MaterialModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(SchedulePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should exist', () => {
    expect(component).toBeTruthy();
  });

  it('should have it\'s menu closed by default', async(inject([Router, Location], (router: Router, location: Location) => {
    expect(component.showMenu).toBe(false);
  })));

  it('should switch back to task', async(inject([Router, Location], (router: Router, location: Location) => {
    const viewListButton = fixture.debugElement.query(By.css("[data-cy='view-list']"));
    viewListButton.triggerEventHandler("click", {});
    fixture.whenStable().then(() => {
      expect(location.path()).toBe("/tasks");
    });
  }))
  );
});
