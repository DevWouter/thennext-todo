import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { skip, map, filter, distinctUntilChanged, debounceTime, first } from "rxjs/operators";
import { TaskParseService, NavigationService } from "../../services";

const SEARCH_DELAY = 300;

@Component({
  selector: "app-command-input",
  templateUrl: "./command-input.component.html",
  styleUrls: ["./command-input.component.scss"]
})
export class CommandInputComponent implements OnInit {
  private _value = "";
  private _searchSubject = new BehaviorSubject("");
  public get value(): string {
    return this._value;
  }
  public set value(v: string) {
    // Set it as the search value.
    if (v.trim() === "") {
      // Cancel search instantly.
      this.navigationService.toTaskPage({ search: "" });
    }

    this._searchSubject.next(v);

    this._value = v;
  }

  constructor(
    private readonly taskCreateService: TaskParseService,
    private readonly navigationService: NavigationService,
  ) { }

  ngOnInit() {
    // TODO: Remove WORKAROUND for the skip and first.
    this._searchSubject
      .pipe(
        skip(1),                                    // Skip the first one. <<-- WORKAROUND
        filter(v => v !== undefined && v !== null), // Ignore invalid values
        map(v => v.trim()),                         // Remove any space before/after
        distinctUntilChanged(),                     // Only listen for changes.
        debounceTime(SEARCH_DELAY)                  // React on the first input, then start ignoring
      ).subscribe(v => {
        this.navigationService.toTaskPage({ search: v });
      });

    // Only restore search on the first load.
    this.navigationService.search
      .pipe(first())                                    // <<-- WORKAROUND
      .subscribe(x => this._value = x);
  }

  submit() {
    this.processInput();
    this.clearInput();
  }

  clearInput(): void {
    this.value = "";
  }

  processInput(): void {
    const value = this.getCleanValue();
    this.taskCreateService.createTask(value);
  }

  getCleanValue(): string {
    return this.value.trim();
  }
}
