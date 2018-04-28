import { Injectable } from "@angular/core";
import { TaskView } from "./models/task-view";

@Injectable()
export class SearchService {

  constructor() { }

  isResult(tv: TaskView, query: string): boolean {
    if (query === undefined || query === null || query.trim().length === 0) {
      return true;
    }
    const queryTerms = query.toLowerCase().split(" ").filter(x => x.length > 0);

    // Needs to contain at least one term.
    return queryTerms.some(term => {
      return tv.task.title.toLowerCase().includes(term);
    });
  }
}
