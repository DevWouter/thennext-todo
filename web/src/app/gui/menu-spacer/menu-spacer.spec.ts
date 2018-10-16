import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuSpacerComponent } from './menu-spacer.component';

describe('MenuSpacerComponent', () => {
  let component: MenuSpacerComponent;
  let fixture: ComponentFixture<MenuSpacerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuSpacerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSpacerComponent);
    component = fixture.componentInstance;
  });

  it('should exists', () => {
    expect(component).toBeDefined();
  });
});
