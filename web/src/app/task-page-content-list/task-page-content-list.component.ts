import { Component, OnInit } from "@angular/core";

import { TaskService } from "../services/task.service";
import { ContextService } from "../services/context.service";

import { Task, TaskStatus } from "../services/models/task.dto";
import { TaskScoreService } from "../services/task-score.service";
import { NavigationService } from "../services/navigation.service";
import { SearchService } from "../services/search.service";
import { RelationViewService } from "../services/relation-view.service";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "app-task-page-content-list",
  templateUrl: "./task-page-content-list.component.html",
  styleUrls: ["./task-page-content-list.component.scss"]
})
export class TaskPageContentListComponent implements OnInit {
  public tasks: Task[] = [];

  constructor(
    private readonly taskService: TaskService,
    private readonly contextService: ContextService,
    private readonly taskScoreService: TaskScoreService,
    private readonly navigationService: NavigationService,
    private readonly searchService: SearchService,
    private readonly relationViewService: RelationViewService,
  ) {
  }

  ngOnInit() {
    this.contextService.activeTaskList.filter(x => !!x)
      .combineLatest(this.taskService.entries, (list, tasks) => tasks.filter(x => x.taskListUuid === list.uuid))
      .combineLatest(this.taskScoreService.taskScores, (tasks, scores) => {
        return scores.map(s => tasks.find(t => t.uuid === s.taskUuid)).filter(y => !!y);
      })
      .map(x => {
        const activeTasks: Task[] = [];
        const todoTasks: Task[] = [];
        const doneTasks: Task[] = [];
        x.forEach(y => {
          switch (y.status) {
            case TaskStatus.done: { doneTasks.push(y); break; }
            case TaskStatus.active: { activeTasks.push(y); break; }
            case TaskStatus.todo: { todoTasks.push(y); break; }
            default: { throw new Error(`Unsupported task status: ${y.status}`); }
          }
        });

        return [...activeTasks, ...todoTasks, ...doneTasks];
      }).combineLatest(this.navigationService.showCompleted, (tasks, showCompleted) => {
        if (!showCompleted) {
          return tasks.filter(y => y.status !== TaskStatus.done);
        }
        return tasks;
      })
      .combineLatest(this.navigationService.showDelayed, this.taskScoreService.delayedTaskUuids,
        (tasks, showDelayed, delayedUuids) => {
          if (!showDelayed) {
            return tasks.filter(y => !delayedUuids.includes(y.uuid));
          }
          return tasks;
        })
      .combineLatest(this.navigationService.onlyUnblocked, this.relationViewService.blockedTaskUuids,
        (tasks, onlyUnblocked, blockedUuids) => {
          if (onlyUnblocked) {
            return tasks.filter(y => !blockedUuids.includes(y.uuid));
          }
          return tasks;
        })
      .combineLatest(this.navigationService.onlyPositive, this.taskScoreService.taskScores,
        (tasks, onlyPositive, scores) => {
          if (onlyPositive) {
            return tasks.filter(task => {
              const taskScore = scores.find(s => s.taskUuid === task.uuid);
              if (taskScore) {
                return taskScore.score >= 0;
              }
              return true; // No score, so we can assume 0.
            });
          }
          return tasks;
        })
      .combineLatest(this.navigationService.search, (tasks, search) => {
        if (search) {
          return tasks.filter(x => this.searchService.isResult(x, search));
        }
        return tasks;
      })
      .subscribe(tasks => this.tasks = tasks);
  }

}
