import { Injectable } from "@angular/core";
import { Task } from "./models/task.dto";

@Injectable()
export class SearchService {

  constructor() { }

  isResult(task: Task, query: string): boolean {
    if (query === undefined || query === null || query.trim().length === 0) {
      return true;
    }
    const queryTerms = query.toLowerCase().split(" ").filter(x => x.length > 0);

    // Needs to contain at least one term.
    return queryTerms.some(term => {
      return task.title.toLowerCase().includes(term);
    });
  }
}
