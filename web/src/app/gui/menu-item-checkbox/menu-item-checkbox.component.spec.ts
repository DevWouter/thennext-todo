import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuItemCheckboxComponent } from './menu-item-checkbox.component';


describe('MenuItemCheckboxComponent', () => {
  let component: MenuItemCheckboxComponent;
  let fixture: ComponentFixture<MenuItemCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuItemCheckboxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuItemCheckboxComponent);
    component = fixture.componentInstance;
  });

  it('should show the square icon when false', () => {
    component.checked = false;
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.icon i') as HTMLElement;
    expect(icon.className).toContain("fa-square");
  });
  it('should show the check-icon when true', () => {
    component.checked = true;
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.icon i') as HTMLElement;
    expect(icon.className).toContain("fa-check-square");
  });
});
