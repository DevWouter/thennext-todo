import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuTasklistItemComponent } from './menu-tasklist-item.component';
import { TaskList } from '../../../models';
import { By } from '@angular/platform-browser';
import { FilterService } from '../../../services';
import { BehaviorSubject } from 'rxjs';
import { TasklistModule } from '../../../tasklist/tasklist.module';


describe('MenuTasklistItemComponent', () => {
  let component: MenuTasklistItemComponent;
  let fixture: ComponentFixture<MenuTasklistItemComponent>;
  let listA: TaskList;
  let filterService: jasmine.SpyObj<FilterService>;

  beforeEach(async(() => {
    filterService = jasmine.createSpyObj<FilterService>("FilerService", ["addList"]);

    TestBed.configureTestingModule({
      declarations: [MenuTasklistItemComponent],
      providers: [
        { provide: FilterService, useValue: filterService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    listA = <TaskList>{ uuid: "list-a", name: "List A" };
    fixture = TestBed.createComponent(MenuTasklistItemComponent);
    component = fixture.componentInstance;
    component.list = listA;
  });

  it('should exist', () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  it('should show the name', () => {
    fixture.detectChanges();
    var rootElement = fixture.nativeElement as HTMLElement;
    expect(rootElement.textContent).toContain(listA.name);
  });

  it('should be unchecked by default', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css(".fa-square"))).toBeTruthy("since the element is inactive");
  });

  it('should send a set-message to filterService when clicked while it was set', () => {
    // Click on the element
    (fixture.nativeElement as HTMLElement).click();
    fixture.detectChanges();

    expect(filterService.addList).toHaveBeenCalledWith(listA);
  });

  it('should become checked when listed in filterService');

  it('should send a unset-message to filterService when clicked while it was unset')

});
