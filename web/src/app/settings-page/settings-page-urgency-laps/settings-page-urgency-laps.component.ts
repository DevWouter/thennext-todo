import { Component, OnInit } from "@angular/core";
import { map } from "rxjs/operators";
import { UrgencyLap } from "../../models";
import { UrgencyLapService } from "../../services";

@Component({
  selector: "app-settings-page-urgency-laps",
  templateUrl: "./settings-page-urgency-laps.component.html",
  styleUrls: ["./settings-page-urgency-laps.component.scss"]
})
export class SettingsPageUrgencyLapsComponent implements OnInit {
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
