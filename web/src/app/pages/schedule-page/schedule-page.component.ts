import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.scss']
})
export class SchedulePageComponent implements OnInit {

  showMenu = false;
  constructor() { }

  ngOnInit() {
  }

  onClickMenuButton() {
    this.showMenu = !this.showMenu;
  }

}
