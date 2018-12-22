/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TasklistSettingsDecryptPanelComponent } from './tasklist-settings-decrypt-panel.component';

describe('TasklistSettingsDecryptPanelComponent', () => {
  let component: TasklistSettingsDecryptPanelComponent;
  let fixture: ComponentFixture<TasklistSettingsDecryptPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasklistSettingsDecryptPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasklistSettingsDecryptPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should exist', () => {
    expect(component).toBeTruthy();
  });

  it('should show a button to decrypt the tasklist');
  it('should invoke the "decrypt-service" when the decrypt button is clicked')
});
