import { Component, OnInit, Input, HostListener, OnDestroy } from '@angular/core';
import { TaskList } from '../../../models';
import { TasklistFilterService, TaskListService } from '../../../services';
import { combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';

@Component({
  selector: 'gui-menu-tasklist-item',
  templateUrl: './menu-tasklist-item.component.html',
  styleUrls: ['./menu-tasklist-item.component.scss', "../menu-item/menu-item.component.scss"]
})
export class MenuTasklistItemComponent implements OnInit {
  public $state: Observable<"none" | "included" | "excluded">;

  private _list: TaskList;
  private $list = new BehaviorSubject<TaskList>(undefined);
  public get list(): TaskList {
    return this._list;
  }

  @Input() public set list(v: TaskList) {
    this._list = v;
    this.$list.next(v);
  }

  constructor(
    private readonly tasklistService: TaskListService,
    private readonly filterService: TasklistFilterService
  ) { }

  ngOnInit(): void {
    this.$state = combineLatest(
      this.$list.pipe(filter(x => !!x)),
      this.filterService.filteredLists,
    ).pipe(map(([list, lists]) => {
      if (lists.length === 0) {
        return "none";
      }

      if (lists.map(x => x.uuid).includes(list.uuid)) {
        return "included";
      } else {
        return "excluded";
      }
    }));
  }

  @HostListener('click')
  public onClick() {
    combineLatest(
      this.tasklistService.entries,
      this.filterService.filteredLists,
    )
      .pipe(take(1))
      .subscribe(([lists, filteredLists]) => {
        if (filteredLists.includes(this._list)) {
          this.filterService.removeList(this._list);
          return;
        }

        // Clear the list when self is the only one missing
        if (filteredLists.length === lists.length - 1 && !filteredLists.includes(this._list)) {
          this.filterService.clear();
          return;
        }

        this.filterService.addList(this.list);
      })
  }
}
