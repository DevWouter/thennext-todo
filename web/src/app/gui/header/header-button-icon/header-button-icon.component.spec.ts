import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderButtonIconComponent } from './header-button-icon.component';

describe('HeaderButtonIconComponent', () => {
  let component: HeaderButtonIconComponent;
  let fixture: ComponentFixture<HeaderButtonIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderButtonIconComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderButtonIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should exist', () => {
    expect(component).toBeDefined();
  });

  it('should change the icon class', () => {
    component.iconClass = "fas fa-cog fa-fw";
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.icon i') as HTMLElement;
    expect(icon.className).toBe("fas fa-cog fa-fw");
  });
});
