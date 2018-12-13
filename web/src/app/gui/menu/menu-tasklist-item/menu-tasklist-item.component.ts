import { Component, OnInit, Input, HostListener } from '@angular/core';
import { TaskList } from '../../../models';
import { FilterService } from '../../../services';

@Component({
  selector: 'gui-menu-tasklist-item',
  templateUrl: './menu-tasklist-item.component.html',
  styleUrls: ['./menu-tasklist-item.component.scss']
})
export class MenuTasklistItemComponent implements OnInit {
  @Input() list: TaskList;

  constructor(
    private readonly filterService: FilterService
  ) { }

  ngOnInit(): void { }

  @HostListener('click')
  public onClick() {
    this.filterService.addList(this.list);
  }
}
