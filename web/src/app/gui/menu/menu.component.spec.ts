import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  describe("default", () => {
    it('should have the menu closed', () => {
      expect(component.expand).toBe(false);
    });

    it('should show the title', () => {
      component.menuTitle = "test123";
      fixture.detectChanges();
      const titleElement = fixture.nativeElement.querySelector('.menu .title') as HTMLElement;
      expect(titleElement.innerText).toBe("test123");
    });
  })

  describe('when hidden', () => {
    beforeEach(() => {
      component.expand = false;
      fixture.detectChanges();
    });
    afterEach(() => {
      // We are closing because the menu will overlap the entire screen.
      component.expand = false;
      fixture.detectChanges();
    });
    it('should not show menu', () => {
      const menu = fixture.nativeElement.querySelector('.menu') as HTMLElement;
      expect(menu.classList).not.toContain("expand");
    });
    it('should not show menu-background', () => {
      const menu = fixture.nativeElement.querySelector('.menu-background') as HTMLElement;
      expect(menu.classList).not.toContain("expand");
    });

    it('should open', () => {
      component.open();
      expect(component.expand).toBe(true);
    });
  })


  describe('when open', () => {
    beforeEach(() => {
      component.expand = true;
      fixture.detectChanges();
    });
    afterEach(() => {
      // We are closing because the menu will overlap the entire screen.
      component.expand = false;
      fixture.detectChanges();
    });

    it('should show menu', () => {
      const menu = fixture.nativeElement.querySelector('.menu') as HTMLElement;
      expect(menu.classList).toContain("expand");
    });

    it('should show menu-background', () => {
      const menu = fixture.nativeElement.querySelector('.menu-background') as HTMLElement;
      expect(menu.classList).toContain("expand");
    });


    it('should close', () => {
      component.close();
      expect(component.expand).toBe(false);
    });
  })
});
