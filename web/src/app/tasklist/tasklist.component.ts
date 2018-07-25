import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { combineLatest } from "rxjs";
import { filter, map, distinctUntilChanged } from "rxjs/operators";

import {
  Task,
  TaskStatus
} from "../models";

import {
  TaskService,
  ContextService,
  TaskScoreService,
  NavigationService,
  SearchService,
  RelationViewService,
  MediaViewService
} from "../services";

@Component({
  selector: "app-tasklist",
  templateUrl: "./tasklist.component.html",
  styleUrls: ["./tasklist.component.scss"]
})
export class TasklistComponent implements OnInit {
  public singleline = true;

  public tasks: Task[] = [];
  public activeTasks: Task[] = [];
  public nonActiveTasks: Task[] = [];

  @Output()
  public taskFoundCount = new EventEmitter<number>();

  constructor(
    private readonly taskService: TaskService,
    private readonly contextService: ContextService,
    private readonly taskScoreService: TaskScoreService,
    private readonly navigationService: NavigationService,
    private readonly searchService: SearchService,
    private readonly relationViewService: RelationViewService,
    private readonly mediaViewService: MediaViewService,
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
        this.taskFoundCount.emit(tasks.length);
        this.tasks = tasks;
        this.activeTasks = tasks.filter(x => x.status === TaskStatus.active);
        this.nonActiveTasks = tasks.filter(x => x.status !== TaskStatus.active);
      });

    this.mediaViewService.extraSmall
      .pipe(distinctUntilChanged())
      .subscribe(isXS => {
        this.singleline = !isXS;
      });
  }

}
