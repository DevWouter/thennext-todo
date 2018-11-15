import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from "@angular/router";
import { StorageService, StorageKey } from "../services";

@Injectable({
  providedIn: "root",
})
export class SessionTokenGuard implements CanActivate, CanActivateChild {

  constructor(
    private readonly storageService: StorageService,
    private readonly router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (this.hasSessionToken()) {
      return true;
    } else {
      this.router.navigate(["/login"]);
      return false;
    }
  }

  private hasSessionToken(): boolean {
    return !!this.storageService.get(StorageKey.SESSION_TOKEN);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(childRoute, state);
  }
}
