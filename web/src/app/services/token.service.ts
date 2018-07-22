import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { StorageService, StorageKey } from "./storage.service";


@Injectable()
export class TokenService {
  private readonly $token = new BehaviorSubject<string>(undefined);

  get token(): Observable<string> { return this.$token; }
  constructor(
    private readonly storageService: StorageService
  ) {
    const token = this.storageService.get(StorageKey.SESSION_TOKEN);
    if (token) {
      this.$token.next(token);
    }
  }


  public set(token: string) {
    this.storageService.set(StorageKey.SESSION_TOKEN, token);
    this.$token.next(token);
  }

  public clear() {
    this.storageService.del(StorageKey.SESSION_TOKEN);
    this.$token.next(undefined);
  }
}
