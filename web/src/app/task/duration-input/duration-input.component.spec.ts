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

  beforeEach(async(() => {
    task = <Task>{ estimatedDuration: null };
    taskServiceMock = Mock.ofType<TaskService>();

    TestBed.configureTestingModule({
      declarations: [DurationInputComponent],
      imports: [FormsModule],
      providers: [
        { provide: TaskService, useFactory: () => taskServiceMock.object }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DurationInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should exist', () => {
    expect(component).toBeTruthy();
  });

  it('should not show input when no task is assigned to the component', () => {
    const inputElements = fixture.debugElement.queryAll(By.css('input'));
    expect(inputElements.length).toBe(0, "since we have no task");
  });

  it('should show input when task is assigned to the component', () => {
    component.task = task;
    fixture.detectChanges();
    const inputElements = fixture.debugElement.queryAll(By.css('input'));
    expect(inputElements.length).not.toBe(0, "since we have a task and as such we can input the duration");
  });

  it('should default to "<empty>" when no estimatedDuration is given', (done) => {
    component.task = task;
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css("[data-cy=duration-value-input]")).nativeElement as HTMLInputElement;
    fixture.whenStable().then(() => {
      expect(input.value).toBe("");
      done();
    });
  });

  it('should show estimated duration as 0 minute(s) when estimatedDuration is 0', (done) => {
    task.estimatedDuration = 0;
    component.task = task;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css("[data-cy=duration-value-input]")).nativeElement as HTMLInputElement;

    fixture.whenStable().then(() => {
      expect(input.value).toBe("0m");
      done();
    });
  });

  it('should set estimate to `null` if input value is cleared', (done) => {
    task.estimatedDuration = 1; // 1 second
    component.task = task;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css("[data-cy=duration-value-input]")).nativeElement as HTMLInputElement;
    component.durationValue = "";
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(() => taskServiceMock.verify(s => s.update(It.isValue(task)), Times.once())).not.toThrow();
      expect(task.estimatedDuration).toBeNull("since we want to remove the esimtatedDuration from the task");
      expect(input.value).toBe("");
      done();
    });
  });

  it('should reject non-numbers', (done) => {
    task.estimatedDuration = 1;
    component.task = task;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css("[data-cy=duration-value-input]")).nativeElement as HTMLInputElement;
    input.value = "abcdef";
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(() => taskServiceMock.verify(s => s.update(It.isAny()), Times.never())).not.toThrow();
      expect(task.estimatedDuration).toBe(1, "since it was never changed");
      expect(input.value).toBe("1s", "since it was never changed");
      done();
    });
  });

  it('should show estimated duration as second(s) when seconds can not be divided by minute-length (60)', (done) => {
    task.estimatedDuration = 61;
    component.task = task;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css("[data-cy=duration-value-input]")).nativeElement as HTMLInputElement;
    fixture.whenStable().then(() => {
      expect(input.value).toBe("61s");
      done();
    });
  });

  it('should show estimated duration as minutes(s) when seconds can not be divided by hour-length (60 * 60)', (done) => {
    task.estimatedDuration = 3660; // 3660 seconds ==> 61 minutes ==> 1 hour + 1 minute
    component.task = task;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css("[data-cy=duration-value-input]")).nativeElement as HTMLInputElement;
    fixture.whenStable().then(() => {
      expect(input.value).toBe("61m");
      done();
    });
  });

  it('should show estimated duration as hours(s) when seconds can not be divided by day-length (60 * 60 * 24)', (done) => {
    task.estimatedDuration = 90000; // 90000 seconds ==> 25 hours minutes ==> 1 day + 1 hour
    component.task = task;
    fixture.detectChanges(true);
    const input = fixture.debugElement.query(By.css("[data-cy=duration-value-input]")).nativeElement as HTMLInputElement;
    fixture.whenStable().then(() => {
      expect(input.value).toBe("25h");
      done();
    });
  });

  it('should show estimated duration as 1 minute(s) when seconds can be divided by 60', (done) => {
    task.estimatedDuration = 60; // 60 seconds ==> 1 minute
    component.task = task;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css("[data-cy=duration-value-input]")).nativeElement as HTMLInputElement;
    fixture.whenStable().then(() => {
      expect(input.value).toBe("1m");
      done();
    });
  });

  it('should show estimated duration as 1 hour(s) when seconds can be divided by 60 * 60', (done) => {
    task.estimatedDuration = 3600; // 3600 seconds ==> 60 minutes ==> 1 hour
    component.task = task;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css("[data-cy=duration-value-input]")).nativeElement as HTMLInputElement;
    fixture.whenStable().then(() => {
      expect(input.value).toBe("1h");
      done();
    });
  });

  it('should show estimated duration as 1 day(s) when seconds can be divided by 60 * 60 * 24', (done) => {
    task.estimatedDuration = 86400; // 86.400 seconds ==> 1440 minutes ==> 24 hour ==> 1 day
    component.task = task;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css("[data-cy=duration-value-input]")).nativeElement as HTMLInputElement;
    fixture.whenStable().then(() => {
      expect(input.value).toBe("1d");
      done();
    });
  });
});
