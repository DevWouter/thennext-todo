import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";


@Injectable()
export class TokenService {
  private readonly $token = new BehaviorSubject<string>(undefined);
  get token(): Observable<string> { return this.$token; }

  public set(token: string) {
    this.$token.next(token);
  }

  public clear() {
    this.$token.next(undefined);
  }
}
