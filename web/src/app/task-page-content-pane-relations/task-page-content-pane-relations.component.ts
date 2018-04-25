import { Component, OnInit } from "@angular/core";
import { ContextService } from "../services/context.service";

@Component({
  selector: "app-task-page-content-pane-relations",
  templateUrl: "./task-page-content-pane-relations.component.html",
  styleUrls: ["./task-page-content-pane-relations.component.scss"]
})
export class TaskPageContentPaneRelationsComponent implements OnInit {

  taskname = "";
  showDropArea = false;

  constructor(
    private contextService: ContextService,
  ) { }

  ngOnInit() {
    this.contextService.activeTaskView.subscribe(x => this.taskname = x.task.title);
  }

}
