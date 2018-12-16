import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuTasklistItemComponent } from './menu-tasklist-item.component';
import { TaskList } from '../../../models';
import { By } from '@angular/platform-browser';
import { TasklistFilterService, TaskListService } from '../../../services';
import { BehaviorSubject, Observable } from 'rxjs';
import { Mock, IMock, It, Times } from "typemoq";


const NONE_ICON = By.css("[data-cy='tasklist-icon-filter-none']");
const INCLUDED_ICON = By.css("[data-cy='tasklist-icon-filter-included']");
const EXCLUDED_ICON = By.css("[data-cy='tasklist-icon-filter-excluded']");

fdescribe('MenuTasklistItemComponent', () => {
  let component: MenuTasklistItemComponent;
  let fixture: ComponentFixture<MenuTasklistItemComponent>;
  let listA: TaskList;
  let listB: TaskList;
  let listC: TaskList;
  let filteredTasklists: BehaviorSubject<TaskList[]>;
  let taskListObservable: BehaviorSubject<TaskList[]>;
  let TasklistFilterServiceMock: IMock<TasklistFilterService>;
  let taskListServiceMock: IMock<TaskListService>;

  beforeEach(async(() => {
    listA = <TaskList>{ uuid: "list-a", name: "List A" };
    listB = <TaskList>{ uuid: "list-b", name: "List B" };
    listC = <TaskList>{ uuid: "list-c", name: "List C" };

    filteredTasklists = new BehaviorSubject<TaskList[]>([]);
    TasklistFilterServiceMock = Mock.ofType<TasklistFilterService>();
    TasklistFilterServiceMock.setup(x => x.filteredLists).returns(() => filteredTasklists as Observable<TaskList[]>);

    taskListObservable = new BehaviorSubject<TaskList[]>([listA, listB, listC]);
    taskListServiceMock = Mock.ofType<TaskListService>();
    taskListServiceMock.setup(x => x.entries).returns(() => taskListObservable as Observable<TaskList[]>);

    TestBed.configureTestingModule({
      declarations: [MenuTasklistItemComponent],
      providers: [
        { provide: TasklistFilterService, useFactory: () => TasklistFilterServiceMock.object },
        { provide: TaskListService, useFactory: () => taskListServiceMock.object }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MenuTasklistItemComponent);
    component = fixture.componentInstance;
    component.list = listA;
  }));

  it('should exist', () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  it('should show the name', () => {
    fixture.detectChanges();
    var rootElement = fixture.nativeElement as HTMLElement;
    expect(rootElement.textContent).toContain(listA.name);
  });

  it('should be greyish visible when no list is filtered', () => {
    filteredTasklists.next([]);
    fixture.detectChanges();
    expect(fixture.debugElement.query(NONE_ICON)).toBeTruthy("since no list at all is filtered");
  });

  it('should be be visible when own list is filtered', () => {
    filteredTasklists.next([listA]);
    fixture.detectChanges();
    expect(fixture.debugElement.query(INCLUDED_ICON)).toBeTruthy("since we are filtering on lists and own is included");
  });

  it('should be hidden filter contains other lists and own list is not included', () => {
    filteredTasklists.next([listB]);
    fixture.detectChanges();
    expect(fixture.debugElement.query(EXCLUDED_ICON)).toBeTruthy("since we are filtering on lists but own is missing");
  });

  it('should send an add message when hidden due to not being in a filled filter list', () => {
    filteredTasklists.next([listB]);
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).click();
    expect(() => {
      TasklistFilterServiceMock.verify(x => x.addList(It.isValue(listA)), Times.once());
    }).not.toThrow();
  });

  it('should send an remove message when shown due to being in a filled filter list', () => {
    filteredTasklists.next([listA]);
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).click();
    expect(() => {
      TasklistFilterServiceMock.verify(x => x.removeList(It.isValue(listA)), Times.once());
    }).not.toThrow();
  });

  it('should send add message when list is empty', () => {
    filteredTasklists.next([]);
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).click();
    expect(() => {
      TasklistFilterServiceMock.verify(x => x.addList(It.isValue(listA)), Times.once());
    }).not.toThrow();
  });


  it('should send add self on click when self is not in filteredlist', () => {
    filteredTasklists.next([listB]);
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).click();
    expect(() => {
      TasklistFilterServiceMock.verify(x => x.addList(It.isValue(listA)), Times.once());
    }).not.toThrow();
  });

  it('should send clear the list on click when only self is not in the list', () => {
    filteredTasklists.next([listB, listC]);
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).click();
    expect(() => {
      TasklistFilterServiceMock.verify(x => x.clear(), Times.once());
    }).not.toThrow();
  });
});
