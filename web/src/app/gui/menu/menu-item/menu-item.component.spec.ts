import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemComponent } from './menu-item.component';

describe('MenuItemComponent', () => {
  let component: MenuItemComponent;
  let fixture: ComponentFixture<MenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should change the icon class', () => {
    component.iconClass = "fas fa-cog fa-fw";
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.icon i') as HTMLElement;
    expect(icon.className).toBe("fas fa-cog fa-fw");
  });
});
