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
  get<T>(path: string, extension: string = ".json"): Observable<T> {
    // Prefix path if missing.
    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    const url = this.resourcePath + path + extension;
    return this.apiService.get(url);
  }
}
