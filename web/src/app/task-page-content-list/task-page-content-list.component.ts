import { Component, OnInit, Input, HostBinding } from "@angular/core";

import { TaskService } from "../services/task.service";
import { ContextService } from "../services/context.service";

import { Task, TaskStatus } from "../services/models/task.dto";
import { TaskScoreService } from "../services/task-score.service";
import { NavigationService } from "../services/navigation.service";
import { SearchService } from "../services/search.service";
import { RelationViewService } from "../services/relation-view.service";
import { combineLatest } from "rxjs";
import { filter, map } from "rxjs/operators";

@Component({
  selector: "app-task-page-content-list",
  templateUrl: "./task-page-content-list.component.html",
  styleUrls: ["./task-page-content-list.component.scss"]
})
export class TaskPageContentListComponent implements OnInit {
  public tasks: Task[] = [];
  public activeTasks: Task[] = [];
  public nonActiveTasks: Task[] = [];

  public showEmptyListMessage = false;
  public showTasks = true;

  @Input()
  set width(value: number) {
    this._width = window.innerWidth - (value + 6);
  }

  @HostBinding("style.width.px")
  private _width: number = undefined;

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
    const $activeTaskListId = this.contextService.activeTaskList.pipe(filter(x => !!x));
    const $tasks = this.taskService.entries;
    const $currentTasks = combineLatest($activeTaskListId, $tasks)
      .pipe(
        map(([list, tasks]) => tasks.filter(x => x.taskListUuid === list.uuid))
      );

    const $tasksWithScore = combineLatest($currentTasks, this.taskScoreService.taskScores)
      .pipe(
        map(([tasks, scores]) => scores.map(s => tasks.find(t => t.uuid === s.taskUuid)).filter(y => !!y))
      );

    const $tasksAfterCompletionFilter = combineLatest($tasksWithScore, this.navigationService.showCompleted)
      .pipe(
        map(([tasks, showCompleted]) => {
          if (!showCompleted) {
            return tasks.filter(y => y.status !== TaskStatus.done);
          }
          return tasks;
        }),
    );

    const $tasksGroupedByStatus = $tasksAfterCompletionFilter
      .pipe(map(x => {
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

        const result = [...activeTasks, ...todoTasks, ...doneTasks.reverse()];
        return result;
      }));

    // NOTE
    // Due to the limtation of combineLatest we can only combine 5 different observables.

    const $navigationView = combineLatest(
      this.navigationService.showDelayed,
      this.navigationService.onlyUnblocked,
      this.navigationService.onlyPositive);

    const $scoreView = combineLatest(
      this.taskScoreService.delayedTaskUuids,
      this.taskScoreService.taskScores);

    const $search = this.navigationService.search;

    const $relationView = combineLatest(
      this.relationViewService.blockedTaskUuids
    );

    const $filterB = combineLatest(
      $tasksGroupedByStatus,
      $search,
      $navigationView,
      $scoreView,
      $relationView,
    );

    const $final = $filterB.pipe(
      map(([
        tasks,
        search,
        [ // Navigations
          showDelayed,
          onlyUnblocked,
          onlyPositive,
        ],
        [ // Score
          delayedUuids,
          scores
        ],
        [ // Relation
          blockedUuids,
        ],
      ]) => {
        if (search && search.trim() !== "") {
          tasks = tasks.filter(x => this.searchService.isResult(x, search));
        } else {
          // No search, so use the filters.
          if (!showDelayed) {
            tasks = tasks.filter(y => !delayedUuids.includes(y.uuid));
          }

          if (onlyUnblocked) {
            tasks = tasks.filter(y => !blockedUuids.includes(y.uuid));
          }

          if (onlyPositive) {
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
      })
    );

    $final
      .subscribe(tasks => {
        this.showEmptyListMessage = tasks.length <= 0;
        this.showTasks = tasks.length > 0;

        this.tasks = tasks;
        this.activeTasks = tasks.filter(x => x.status === TaskStatus.active);
        this.nonActiveTasks = tasks.filter(x => x.status !== TaskStatus.active);
      });
  }

}
