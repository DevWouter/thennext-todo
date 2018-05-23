import { Observable ,  BehaviorSubject } from "rxjs";

import { Entity } from "./entity";
import { ApiService } from "../api.service";
import { DirectApiResource } from "./direct-api-resource";

export class ApiResource<T extends Entity> {
  private _direct: DirectApiResource;

  get direct(): DirectApiResource {
    return this._direct;
  }

  constructor(
    private apiService: ApiService,
    private resourcePath: string,
  ) {
    this._direct = new DirectApiResource(apiService, resourcePath);
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
