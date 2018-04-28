import { Component, OnInit } from "@angular/core";
import { ContextService } from "../services/context.service";
import { TaskRelationService } from "../services/task-relation.service";
import { TaskService } from "../services/task.service";
import { TaskViewService } from "../services/task-view.service";
import { TaskRelation } from "../services/models/task-relation.dto";
import { Task, TaskStatus } from "../services/models/task.dto";
import { NavigationService } from "../services/navigation.service";

class RemoteTask {
  relationUuid: string;
  taskUuid: string;
  taskTitle: string;
  isDone: boolean;

  constructor(task: Task, public relation: TaskRelation) {
    this.relationUuid = relation.uuid;
    this.taskUuid = task.uuid;
    this.taskTitle = task.title;
    this.isDone = task.status === TaskStatus.done;
  }
}

@Component({
  selector: "app-task-page-content-pane-relations",
  templateUrl: "./task-page-content-pane-relations.component.html",
  styleUrls: ["./task-page-content-pane-relations.component.scss"]
})
export class TaskPageContentPaneRelationsComponent implements OnInit {

  taskname = "";
  taskUuid: string;
  showDropArea = false;
  taskDragging: string = undefined;
  showExplain = false;

  beforeAllow = true;
  afterAllow = true;

  tasksBefore: RemoteTask[] = [];
  tasksAfter: RemoteTask[] = [];

  constructor(
    private contextService: ContextService,
    private taskRelationService: TaskRelationService,
    private taskService: TaskService,
    private navigationService: NavigationService,
  ) { }

  ngOnInit() {
    this.contextService.taskDragStatus.subscribe(x => {
      this.showDropArea = x;
    });

    this.contextService.taskDragging.subscribe(x => {
      this.beforeAllow = this.taskRelationService.checkAllow({ before: x, after: this.taskUuid });
      this.afterAllow = this.taskRelationService.checkAllow({ after: x, before: this.taskUuid });
    });

    this.contextService.activeTaskView.subscribe(x => {
      if (x) {
        this.taskname = x.task.title;
        this.taskUuid = x.task.uuid;
      }
    });

    this.taskRelationService.entries.combineLatest(
      this.taskService.entries,
      this.contextService.activeTaskView.filter(x => !!x),
      (relations, tasks, currentTask) => {
        const blockedTasks = relations
          .filter(x => x.sourceTaskUuid === currentTask.task.uuid)
          .map(relation => {
            const remoteTaskUuid = relation.targetTaskUuid;
            const remoteTask = tasks.find(t => t.uuid === remoteTaskUuid);
            return new RemoteTask(remoteTask, relation);
          });

        const blockingTasks = relations
          .filter(x => x.targetTaskUuid === currentTask.task.uuid)
          .map(relation => {
            const remoteTaskUuid = relation.sourceTaskUuid;
            const remoteTask = tasks.find(t => t.uuid === remoteTaskUuid);
            return new RemoteTask(remoteTask, relation);
          });

        return { tasksAfter: blockedTasks, tasksBefore: blockingTasks };
      })
      .subscribe(x => {
        this.showExplain = x.tasksAfter.length === 0 && x.tasksBefore.length === 0;
        this.tasksBefore = x.tasksBefore;
        this.tasksAfter = x.tasksAfter;
      });
  }

  dragover(event: DragEvent, relationType: "before" | "after") {
    const remoteUuid = event.dataTransfer.getData("task/uuid");

    if (relationType === "before") {
      if (!this.beforeAllow) {
        return;
      }
    } else if (relationType === "after") {
      if (!this.afterAllow) {
        return;
      }
    }
    event.dataTransfer.dropEffect = "copy";
    event.preventDefault(); // It is allowed.
  }

  delete(task: RemoteTask) {
    this.taskRelationService.delete(task.relation);
  }

  drop(event: DragEvent, relationType: "before" | "after") {
    const remoteUuid = event.dataTransfer.getData("task/uuid");

    if (relationType === "before") {
      if (!this.beforeAllow) {
        return;
      }
    } else if (relationType === "after") {
      if (!this.afterAllow) {
        return;
      }
    }

    event.preventDefault(); // It is allowed

    const source = relationType === "before" ? remoteUuid : this.taskUuid;
    const target = relationType !== "before" ? remoteUuid : this.taskUuid;

    this.taskRelationService.add(<TaskRelation>{
      sourceTaskUuid: source,
      targetTaskUuid: target,
      relationType: "blocks",
    });
  }

  goTo(remoteTask: RemoteTask) {
    this.navigationService.toTaskPage({ taskUuid: remoteTask.taskUuid });
  }
}
