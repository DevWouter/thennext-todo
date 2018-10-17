import { Component, OnInit } from "@angular/core";
import { map } from "rxjs/operators";

import { UrgencyLapService } from "../../../services";
import { UrgencyLap } from "../../../models";

@Component({
  selector: "app-tab-urgency",
  templateUrl: "./tab-urgency.component.html",
  styleUrls: ["./tab-urgency.component.scss"]
})
export class SettingsTabUrgencyComponent implements OnInit {
  items: UrgencyLap[];
  newFromDay = 0;
  newUrgencyModifier = 0;

  constructor(
    private readonly urgencyLapService: UrgencyLapService,
  ) { }

  ngOnInit() {
    this.urgencyLapService.entries.pipe(
      map(x => {
        return x.sort((a, b) => a.fromDay - b.fromDay);
      })
    )
      .subscribe(x => this.items = x);
  }

  delete(item: UrgencyLap) {
    this.urgencyLapService.delete(item);
  }

  create() {
    this.newFromDay = parseFloat(this.newFromDay.toString());
    this.newUrgencyModifier = parseFloat(this.newUrgencyModifier.toString());

    this.urgencyLapService.add(<UrgencyLap>{ fromDay: this.newFromDay, urgencyModifier: this.newUrgencyModifier });

    this.newUrgencyModifier = 0;
    this.newFromDay = 0;
  }

}
