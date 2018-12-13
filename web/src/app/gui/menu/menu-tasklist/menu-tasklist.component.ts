import { Component, OnInit } from '@angular/core';
import { TaskList } from '../../../models';
import { TaskListService } from '../../../services';
import { Observable } from 'rxjs';

@Component({
  selector: 'gui-menu-tasklist',
  templateUrl: './menu-tasklist.component.html',
  styleUrls: ['./menu-tasklist.component.scss']
})
export class MenuTasklistComponent implements OnInit {
  $taskLists: Observable<TaskList[]>;

  constructor(
    private readonly tasklistService: TaskListService,
  ) { }

  ngOnInit(): void {
    this.$taskLists = this.tasklistService.entries;
  }
}
