import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services';
import { filter, debounceTime, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tab-personal',
  templateUrl: './tab-personal.component.html',
  styleUrls: ['./tab-personal.component.scss']
})
export class SettingsTabPersonalComponent implements OnInit {
  private $displayName = new Subject<string>();
  private _displayName: string;
  public get displayName(): string {
    return this._displayName;
  }
  public set displayName(v: string) {
    this._displayName = v;
    this.$displayName.next(v);
  }

  constructor(
    private readonly accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.accountService.myAccount
      .pipe(filter(x => !!x))
      .subscribe(x => this._displayName = x.displayName);

    this.$displayName
      .pipe(debounceTime(300))
      .subscribe(() => this.save());
  }

  private async save() {
    await this.accountService.updatePersonal({ displayName: this.displayName });
  }
}
