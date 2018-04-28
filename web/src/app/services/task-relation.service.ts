import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

import { ApiRepository } from "./repositories/api-repository";
import { Repository } from "./repositories/repository";

import { ApiService } from "./api.service";

import { TaskRelation, TaskRelationType } from "./models/task-relation.dto";

@Injectable()
export class TaskRelationService {
  private _internalList: TaskRelation[] = [];
  private _repository: Repository<TaskRelation>;
  public get entries(): Observable<TaskRelation[]> {
    return this._repository.entries;
  }

  constructor(
    private apiService: ApiService,
  ) {
    this._repository = new ApiRepository(apiService, "/api/task-relation");
    this._repository.entries.subscribe(x => this._internalList = x);
  }

  add(value: TaskRelation): Promise<TaskRelation> {
    value.relationType = value.relationType || TaskRelationType.blocks;
    return this._repository.add(value);
  }

  update(value: TaskRelation): Promise<TaskRelation> {
    return this._repository.update(value);
  }

  delete(value: TaskRelation): Promise<TaskRelation> {
    return this._repository.delete(value);
  }

  deleteMany(values: TaskRelation[]): Promise<TaskRelation[]> {
    return this._repository.deleteMany(values);
  }

  findAllParents(child: string, relations: TaskRelation[]): string[] {
    const parents: string[] = [];
    let searchList: string[] = [child];
    // Keep searching as long as we have an item in the list
    while (searchList.length !== 0) {
      const foundParentIds = searchList
        .map(c => relations
          .filter(r => r.targetTaskUuid === c)
          .map(r => r.sourceTaskUuid)
        );

      const flattenParentList = foundParentIds.reduce((pv, cv) => {
        cv.forEach(c => {
          if (!pv.includes(c)) {
            pv.push(c);
          }
        });
        return pv;
      }, <string[]>[]);

      // If parents are not parent list
      // - Add them to parent list
      // - Add them to search list
      const missingParents = flattenParentList
        .filter(x => !parents.includes(x));

      parents.push(...missingParents);
      searchList = missingParents;
    }

    return parents;
  }

   checkAllow(input: { before: string, after: string }): boolean {
    if (input.before === input.after) {
      // A relation with yourself is not allowed.
      return false;
    }

    // Check if after isn't already set before.
    const parentUuids = this.findAllParents(input.before, this._internalList);
    if (parentUuids.some(x => x === input.after)) {
      // The tasks we want to occur later, is already placed before.
      // You can't be the child of your own child, so we reject it.
      return false;
    }

    return true;
  }
}