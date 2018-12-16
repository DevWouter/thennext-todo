import { TasklistFilterService } from "./tasklist-filter.service";
import { take, skip } from "rxjs/operators";
import { TaskList } from "../../models";
import { IMock, Mock } from "typemoq";
import { TasklistEventService } from "./tasklist-event.service";
import { Subject } from "rxjs";

describe('TasklistFilterService', () => {
  let filterService: TasklistFilterService;
  let tasklistEventServiceMock: IMock<TasklistEventService>;
  let tasklistDeleteSubject: Subject<TaskList>;
  let listA: TaskList;
  let listB: TaskList;
  let listC: TaskList;

  beforeEach(() => {
    listA = <TaskList>{ uuid: "list-a", name: "List A" };
    listB = <TaskList>{ uuid: "list-b", name: "List B" };
    listC = <TaskList>{ uuid: "list-c", name: "List C" };

    tasklistDeleteSubject = new Subject<TaskList>();

    tasklistEventServiceMock = Mock.ofType<TasklistEventService>();
    tasklistEventServiceMock.setup(x => x.deletedTasklist).returns(() => tasklistDeleteSubject);

    filterService = new TasklistFilterService(tasklistEventServiceMock.object);
  });

  it('should exist', () => {
    expect(filterService).toBeDefined();
  });

  it('should have no list initially', (done) => {
    filterService.filteredLists
      .pipe(take(1))
      .subscribe(x => {
        expect(x.length).toBe(0);
        done();
      });
  });

  it('should have one item when adding one', (done) => {
    filterService.filteredLists
      .pipe(skip(1), take(1))
      .subscribe(x => {
        expect(x.length).toBe(1);
        done();
      });

    filterService.addList(listA);
  });

  it('should throw an error when adding an item that is already listed', () => {
    filterService.addList(listA);
    const act = () => filterService.addList(listA);

    expect(act).toThrowError("list is already in filter and can't be added a second time");
  });

  it('should have two item when adding two', (done) => {
    filterService.filteredLists
      .pipe(skip(2), take(1))
      .subscribe(x => {
        expect(x.length).toBe(2);
        done();
      });

    filterService.addList(listA);
    filterService.addList(listB);
  });

  it('should remove an item that was added', (done) => {
    filterService.filteredLists
      .pipe(skip(2), take(1))
      .subscribe(x => {
        expect(x.length).toBe(0);
        done();
      });

    filterService.addList(listA);
    filterService.removeList(listA);
  });

  it('should throw an error when removing an item that was not on the list', () => {
    const act = () => filterService.removeList(listA);

    expect(act).toThrowError("unable to remove list since it is not part of the filter");
  });

  it('should remove lists from filter when the tasklist is removed', (done) => {
    filterService.filteredLists
      .pipe(skip(2), take(1))
      .subscribe(x => {
        expect(x.length).toBe(0);
        done();
      });

    filterService.addList(listA);
    // And we remove the list
    tasklistDeleteSubject.next(listA);
  });

  it('should not remove lists from filter when they are not part of it', (done) => {
    filterService.filteredLists
      .pipe(skip(2), take(1))
      .subscribe(x => {
        expect(x).toContain(listC, "since this was the last one added");
        expect(x).toContain(listA, "since this one should not have been removed");
        expect(x).not.toContain(listB, "since it was never added");
        done();
      });

    // Add list A
    filterService.addList(listA);
    // Tell that list B was removed
    tasklistDeleteSubject.next(listB);
    // Add list C
    filterService.addList(listC);
  });

  it('should be empty when clear is called', (done) => {
    filterService.filteredLists
      .pipe(skip(3), take(1))
      .subscribe(x => {
        expect(x.length).toBe(0);
        done();
      });

    filterService.addList(listA);
    filterService.addList(listB);
    filterService.clear();
  });
});
