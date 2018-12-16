import { TasklistEventService } from "./tasklist-event.service";
import { TaskList } from "../../models";
import { take } from "rxjs/operators";

describe('TasklistEventService', () => {
  let tasklistEventService: TasklistEventService;
  let listA: TaskList;

  beforeEach(() => {
    listA = <TaskList>{ uuid: "list-a", name: "List A" };
    tasklistEventService = new TasklistEventService();
  });

  it('should exist', () => {
    expect(tasklistEventService).toBeDefined();
  });

  it('should report when a tasklist is removed', (done) => {
    tasklistEventService.deletedTasklist
      .pipe(take(1))
      .subscribe(x => {
        expect(x).toBe(listA);
        done();
      });

    tasklistEventService.deleted(listA);
  });
});
