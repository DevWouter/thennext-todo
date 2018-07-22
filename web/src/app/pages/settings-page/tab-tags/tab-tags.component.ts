import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ScoreShift } from '../../../models';
import { ScoreShiftService } from '../../../services';

@Component({
  selector: 'settings-tab-tags',
  templateUrl: './tab-tags.component.html',
  styleUrls: ['./tab-tags.component.scss']
})
export class SettingsTabTagsComponent implements OnInit {
  items: ScoreShift[];
  newPhrase = "";
  newScore = 0;

  constructor(
    private readonly scoreShiftService: ScoreShiftService,
  ) { }

  ngOnInit() {
    this.scoreShiftService.entries.pipe(
      map(x => x.sort((a, b) => b.score - a.score))
    )
      .subscribe(x => this.items = x);
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
