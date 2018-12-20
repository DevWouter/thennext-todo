/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TasklistSettingsKeyinputPanelComponent } from './tasklist-settings-keyinput-panel.component';

describe('TasklistSettingsKeyinputPanelComponent', () => {
  let component: TasklistSettingsKeyinputPanelComponent;
  let fixture: ComponentFixture<TasklistSettingsKeyinputPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasklistSettingsKeyinputPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasklistSettingsKeyinputPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should exist', () => {
    expect(component).toBeTruthy();
  });
});
