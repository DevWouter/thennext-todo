import { Injectable, OnDestroy } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

export const MIN_TABLET_WIDTH = 768;
export const MIN_LAPTOP_WIDTH = 992;
export const MIN_DESKTOP_WIDTH = 1200;

export const MAX_MOBILE_WIDTH = MIN_TABLET_WIDTH - 1;
export const MAX_TABLET_WIDTH = MIN_LAPTOP_WIDTH - 1;
export const MAX_LAPTOP_WIDTH = MIN_DESKTOP_WIDTH - 1;

@Injectable()
export class MediaViewService implements OnDestroy {
  private _func;
  private _windowSize = new BehaviorSubject<number>(window.innerWidth);
  public get windowSize(): Observable<number> { return this._windowSize; }

  public get extraSmall(): Observable<boolean> {
    return this.windowSize.pipe(map(x => x < MIN_TABLET_WIDTH));
  }
  public get small(): Observable<boolean> {
    return this.windowSize.pipe(map(x => x >= MIN_TABLET_WIDTH && x < MIN_LAPTOP_WIDTH));
  }
  public get medium(): Observable<boolean> {
    return this.windowSize.pipe(map(x => x >= MIN_LAPTOP_WIDTH && x < MIN_DESKTOP_WIDTH));
  }
  public get large(): Observable<boolean> {
    return this.windowSize.pipe(map(x => x >= MIN_DESKTOP_WIDTH));
  }

  constructor() {
    this._func = this.onResize.bind(this); // Bind the function to the media view service
    window.addEventListener("resize", this._func);
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", this._func);
  }

  private onResize() {
    this._windowSize.next(window.innerWidth);
  }
}
