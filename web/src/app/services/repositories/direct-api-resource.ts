import { Observable } from "rxjs";

import { ApiService } from "../api.service";

export class DirectApiResource {
  constructor(
    private apiService: ApiService,
    private resourcePath: string,
  ) { }

  /**
  * Allows the user to call alternative GET methods on the resource.
  * @param path The path we wish to call.
  */
  get<T>(path: string): Observable<T> {
    path = this.fixPath(path);
    const url = this.resourcePath + path;
    return this.apiService.get(url);
  }

  post<T>(path: string, body: any): Observable<T> {
    path = this.fixPath(path);
    const url = this.resourcePath + path;
    return this.apiService.post<T>(url, body);
  }

  private fixPath(path: string): string {
    // Prefix path if missing.
    if (!path.startsWith("/")) {
      return "/" + path;
    }

    return path;
  }
}
