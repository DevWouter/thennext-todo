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
      .combineLatest(this.navigationService.showCompleted, (tasks, showCompleted) => {
        if (!showCompleted) {
          return tasks.filter(y => y.status !== TaskStatus.done);
        }
        return tasks;
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
      })
      .combineLatest(
        this.navigationService.search,
        this.navigationService.showDelayed,
        this.navigationService.onlyUnblocked,
        this.navigationService.onlyPositive,
        this.taskScoreService.delayedTaskUuids,
        (tasks, search, showDelayed, onlyUnblocked, onlyPositive) => {
          return {
            tasks,
            search,
            showDelayed,
            onlyUnblocked,
            onlyPositive
          };
        })
      .combineLatest(
        this.taskScoreService.delayedTaskUuids,
        this.relationViewService.blockedTaskUuids,
        this.taskScoreService.taskScores,
        (combo, delayedUuids, blockedUuids, scores) => {
          let tasks = combo.tasks;

          if (combo.search && combo.search.trim() !== "") {
            tasks = tasks.filter(x => this.searchService.isResult(x, combo.search));
          } else {
            // No search, so use the filters.
            if (!combo.showDelayed) {
              tasks = tasks.filter(y => !delayedUuids.includes(y.uuid));
            }

            if (combo.onlyUnblocked) {
              tasks = tasks.filter(y => !blockedUuids.includes(y.uuid));
            }

            if (combo.onlyPositive) {
              tasks = tasks.filter(task => {
                const taskScore = scores.find(s => s.taskUuid === task.uuid);
                if (taskScore) {
                  return taskScore.score >= 0;
                }
                return true; // No score, so we can assume 0.
              });
            }
          }


          return tasks;
        }
      )
      .subscribe(tasks => this.tasks = tasks);
  }

}
