import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

/**
 * This class contains information about the state of the tasklist.
 * Whenever we leave something to `undefined` we mean it won't be changed.
 * Setting values to `null` means set to setting to `undefined` (AKA: remove it).
 */
export class TaskPageNavigation {

}

@Injectable()
export class NavigationService {

  constructor(
    private router: Router
  ) { }

  toRoot() {
    this.router.navigate(["/"]);
  }

  toTaskPage(navigation: TaskPageNavigation) {
    this.router.navigate(["/tasks"]);
  }
}
