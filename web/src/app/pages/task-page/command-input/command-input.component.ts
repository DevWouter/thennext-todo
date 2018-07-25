import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { map, filter, distinctUntilChanged, debounceTime } from "rxjs/operators";
import { TaskParseService, NavigationService } from "../../../services";

const SEARCH_DELAY = 300;

@Component({
  selector: "app-command-input",
  templateUrl: "./command-input.component.html",
  styleUrls: ["./command-input.component.scss"]
})
export class CommandInputComponent implements OnInit {
  private _value = "";
  private _searchSubject = new Subject<string>();
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
    this._searchSubject
      .pipe(
        filter(v => v !== undefined && v !== null), // Ignore invalid values
        map(v => v.trim()),                         // Remove any space before/after
        distinctUntilChanged(),                     // Only listen for changes.
        debounceTime(SEARCH_DELAY)                  // React on the first input, then start ignoring
      ).subscribe(v => {
        this.navigationService.toTaskPage({ search: v });
      });

    // Only restore search on the first load.
    this.navigationService.search
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
