import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuTasklistComponent } from './menu-tasklist.component';
import { TaskList } from '../../../models';
import { MenuTasklistItemComponent } from '../menu-tasklist-item/menu-tasklist-item.component';
import { By } from '@angular/platform-browser';
import { TaskListService, FilterService } from '../../../services';
import { BehaviorSubject, Observable } from 'rxjs';

describe('MenuTasklistComponent', () => {
  let listA: TaskList;
  let listB: TaskList;
  let component: MenuTasklistComponent;
  let fixture: ComponentFixture<MenuTasklistComponent>;
  let taskLists: BehaviorSubject<TaskList[]>;
  let filterService: jasmine.SpyObj<FilterService>;

  beforeEach(async(() => {
    taskLists = new BehaviorSubject<TaskList[]>([]);
    filterService = jasmine.createSpyObj<FilterService>("FilerService", ["addList"]);

    TestBed.configureTestingModule({
      declarations: [
        MenuTasklistComponent,
        MenuTasklistItemComponent
      ],
      providers: [
        { provide: TaskListService, useValue: { entries: taskLists } },
        { provide: FilterService, useValue: filterService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    listA = <TaskList>{ uuid: "list-a", name: "List A" }
    listB = <TaskList>{ uuid: "list-b", name: "List B" }
    fixture = TestBed.createComponent(MenuTasklistComponent);
    component = fixture.componentInstance;
  });

  it('should have no elements to begin with', () => {
    fixture.detectChanges();
    const rootElement = fixture.nativeElement as HTMLElement;
    expect(rootElement.querySelectorAll("gui-menu-tasklist-item").length).toBe(0);
  });

  it('should show 1 lists if there is 1', () => {
    // Add 1 list
    taskLists.next([listA]);

    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(By.directive(MenuTasklistItemComponent));
    const itemComponents = elements.map(de => de.injector.get(MenuTasklistItemComponent));

    expect(itemComponents.length).toBe(1);
    expect(itemComponents[0].list).toBe(listA);
  });

  it('should show 2 lists if there is 2', () => {
    // Add 2 list
    taskLists.next([listA, listB]);

    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(By.directive(MenuTasklistItemComponent));
    const itemComponents = elements.map(de => de.injector.get(MenuTasklistItemComponent));
    expect(itemComponents.length).toBe(2);
    expect(itemComponents[0].list).toBe(listA);
    expect(itemComponents[1].list).toBe(listB);
  });

  it('should set the list value of each component', () => {
    taskLists.next([listA, listB]);

    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(By.directive(MenuTasklistItemComponent));
    const itemComponents = elements.map(de => de.injector.get(MenuTasklistItemComponent));

    const itemA = itemComponents[0];
    const itemB = itemComponents[1];

    expect(itemA.list).toBe(listA);
    expect(itemB.list).toBe(listB);
  });
});
