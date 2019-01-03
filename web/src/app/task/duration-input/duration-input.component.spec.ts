/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IMock, Mock, It, Times } from 'typemoq';
import { DurationInputComponent } from './duration-input.component';
import { Task } from '../../models';
import { TaskService } from '../../services';
import { FormsModule } from '@angular/forms';

describe('DurationInputComponent', () => {
  let component: DurationInputComponent;
  let fixture: ComponentFixture<DurationInputComponent>;
  let task: Task;
  let taskServiceMock: IMock<TaskService>;
  let spyEvent: jasmine.SpyObj<{ preventDefault: () => void }>
  let setValue: (v: string, event: "keyup" | "change") => void;
  let getInputDebug: () => DebugElement;
  let getInput: () => HTMLInputElement;
  let basicSetup: (seconds: undefined | null | number) => void;

  beforeEach(async(() => {
    task = <Task>{ estimatedDuration: null };
    taskServiceMock = Mock.ofType<TaskService>();
    spyEvent = jasmine.createSpyObj<{ preventDefault: () => void }>("event", ["preventDefault"]);

    TestBed.configureTestingModule({
      declarations: [DurationInputComponent],
      imports: [FormsModule],
      providers: [
        { provide: TaskService, useFactory: () => taskServiceMock.object }
      ]
    }).compileComponents();

    basicSetup = (seconds: undefined | null | number) => {
      task.estimatedDuration = seconds;
      component.task = task;
      fixture.detectChanges();
    }

    getInputDebug = () => {
      return fixture.debugElement.query(By.css("[data-cy=duration-input]"));
    }

    getInput = () => {
      return (getInputDebug().nativeElement as HTMLInputElement)
    }

    setValue = (v: string, event: "keyup" | "change") => {
      const el = getInputDebug();
      getInput().value = v;
      el.triggerEventHandler(event, spyEvent);
      fixture.detectChanges();
    }
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DurationInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should exist', () => {
    expect(component).toBeTruthy();
  });

  it('should not show the input when no task is set', (done) => {
    component.task = undefined;
    fixture.detectChanges(true);
    fixture.whenStable().then(
      () => {
        expect(getInputDebug()).toBeNull();
        done();
      }
    )
  });

  it('should show the amount of minutes', (done) => {
    basicSetup(60);
    fixture.whenStable().then(
      () => {
        expect(getInput().value).toBe("1");
        done();
      });
  });

  it('should show show no text when no time is estimated', (done) => {
    basicSetup(undefined);
    fixture.whenStable().then(
      () => {
        expect(getInput().value).toBe("");
        done();
      }
    );
  });

  it('should update the estimatedDuration on change', (done) => {
    basicSetup(undefined);
    setValue("1", "change");
    fixture.whenStable().then(
      () => {
        expect(task.estimatedDuration).toBe(60);
        expect(() => taskServiceMock.verify(x => x.update(It.isValue(task)), Times.once())).not.toThrow();
        done();
      }
    );
  })

  it('should update the estimatedDuration on keyup', (done) => {
    basicSetup(undefined);
    setValue("1", "keyup");
    fixture.whenStable().then(
      () => {
        expect(task.estimatedDuration).toBe(60);
        expect(() => taskServiceMock.verify(x => x.update(It.isValue(task)), Times.once())).not.toThrow();
        done();
      }
    );
  })

  it('should clamp numbers above 1440 minutes to 1440 minutes', (done) => {
    basicSetup(undefined);
    setValue("1500", "change");
    fixture.whenStable().then(
      () => {
        expect(task.estimatedDuration).toBe(1440 * 60, "since we save in seconds, not minutes");
        expect(getInput().value).toBe("1440", "since we display in minutes");
        expect(() => taskServiceMock.verify(x => x.update(It.isValue(task)), Times.once())).not.toThrow();
        done();
      }
    );
  });

  it('should unset the task estimated when input is made empty', (done) => {
    basicSetup(60); // 1 minute
    setValue("", "change");
    fixture.whenStable().then(
      () => {
        expect(task.estimatedDuration).toBeNull("since we have removed the estimate");
        expect(getInput().value).toBe("", "since we have removed the estimate");
        expect(() => taskServiceMock.verify(x => x.update(It.isValue(task)), Times.once())).not.toThrow();
        done();
      }
    );
  });

  it('should not send a task update when value is the same', (done) => {
    basicSetup(60); // 1 minute
    setValue("1", "change");
    fixture.whenStable().then(
      () => {
        expect(() => taskServiceMock.verify(x => x.update(It.isValue(task)), Times.never())).not.toThrow();
        done();
      }
    );
  });

  it('should reject negative numbers', (done) => {
    basicSetup(60); // 1 minute
    setValue("-2", "change");
    fixture.whenStable().then(
      () => {
        expect(task.estimatedDuration).toBe(60, "since we haven't updated the original");
        expect(getInput().value).toBe("1", "since we haven't updated the original");
        expect(spyEvent.preventDefault).toHaveBeenCalledTimes(1);
        expect(() => taskServiceMock.verify(x => x.update(It.isValue(task)), Times.never())).not.toThrow();
        done();
      }
    );
  });
});
