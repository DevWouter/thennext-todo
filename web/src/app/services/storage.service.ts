import { Injectable } from "@angular/core";

export enum StorageKey {
  SESSION_TOKEN = "SESSION_TOKEN",
}

@Injectable()
export class StorageService {
  set(key: string | StorageKey, value: string) {
    localStorage.setItem(key, value);
  }

  get(key: string | StorageKey): string {
    return localStorage.getItem(key);
  }

  del(key: string | StorageKey) {
    return localStorage.removeItem(key);
  }

  keys(): string[] {
    const result: string[] = [];
    for (let i = 0; i < localStorage.length; ++i) {
      result.push(localStorage.key(i));
    }

    return result;
  }
}
