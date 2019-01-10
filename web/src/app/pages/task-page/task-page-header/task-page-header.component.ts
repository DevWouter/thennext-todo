import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { TaskList } from '../../../models';
import { TaskListService, ContextService, NavigationService } from '../../../services';

@Component({
  selector: 'app-task-page-header',
  templateUrl: './task-page-header.component.html',
  styleUrls: ['./task-page-header.component.scss']
})
export class TaskPageHeaderComponent implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();

  public $lists: Observable<TaskList[]>;
  public $currentListControl = new FormControl();

  @Output() menuClick = new EventEmitter<void>();

  constructor(
    private readonly taskListService: TaskListService,
    private readonly contextService: ContextService,
    private readonly navigation: NavigationService,
  ) { }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngOnInit() {
    this.$lists = this.taskListService.entries;
    this.subscriptions.add(
      this.contextService.activeTaskList
        .pipe(filter(x => !!x))
        .subscribe(x => this.$currentListControl.setValue(x.uuid, { emitEvent: false }))
    );

    this.subscriptions.add(
      this.$currentListControl.valueChanges.subscribe(tasklistUuid => {
        this.navigation.toTaskPage({ taskListUuid: tasklistUuid, taskUuid: null });
      })
    );
  }

  onMenuClick() {
    this.menuClick.emit();
  }
}
