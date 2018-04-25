import { Component, OnInit } from "@angular/core";
import { ScoreShift } from "../services/models/score-shift.dto";
import { ScoreShiftService } from "../services/score-shift.service";

@Component({
  selector: "app-settings-page-scoreshifts",
  templateUrl: "./settings-page-scoreshifts.component.html",
  styleUrls: ["./settings-page-scoreshifts.component.scss"]
})
export class SettingsPageScoreshiftsComponent implements OnInit {
  items: ScoreShift[];
  newPhrase = "";
  newScore = 0;

  constructor(
    private readonly scoreShiftService: ScoreShiftService,
  ) { }

  ngOnInit() {
    this.scoreShiftService.entries.subscribe(x => this.items = x);
  }

  delete(item: ScoreShift) {
    this.scoreShiftService.delete(item);
  }

  create() {
    this.newPhrase = this.newPhrase.trim();
    this.newScore = parseInt(this.newScore.toString(), 10);
    if (this.newPhrase === "" || this.newScore === 0) {
      return;
    }

    this.scoreShiftService.add(<ScoreShift>{ phrase: this.newPhrase, score: this.newScore });

    this.newScore = 0;
    this.newPhrase = "";
  }
}
