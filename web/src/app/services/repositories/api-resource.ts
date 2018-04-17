import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { Entity } from "./entity";
import { ApiService } from "../api.service";
import { DirectApiResource } from "./direct-api-resource";

export class ApiResource<T extends Entity> {
  private _ready = new BehaviorSubject<boolean>(false);
  private _direct: DirectApiResource;

  get direct(): DirectApiResource {
    return this._direct;
  }

  public get ready(): Observable<boolean> {
    return this._ready;
  }

  constructor(
    private apiService: ApiService,
    private resourcePath: string,
  ) {
    this._direct = new DirectApiResource(apiService, resourcePath);
    apiService.ready.subscribe(x => this._ready.next(x));
  }

  index(): Observable<T[]> {
    const url = this.resourcePath + "/index";
    return this.apiService.get<T[]>(url);
  }
  create(value: T): Observable<T> {
    const url = this.resourcePath + "/create";
    return this.apiService.post<T>(url, value);
  }
  show(uuid: number): Observable<T> {
    const url = this.resourcePath + `/${uuid}`;
    return this.apiService.get<T>(url);
  }
  update(value: T): Observable<T> {
    const url = this.resourcePath + `/${value.uuid}`;
    return this.apiService.patch<T>(url, value);
  }
  destroy(value: T): Observable<T> {
    const url = this.resourcePath + `/${value.uuid}`;
    return this.apiService.delete(url);
  }
}
