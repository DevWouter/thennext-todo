/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, } from '@angular/core/testing';

import { CommonPageFooterComponent } from './common-page-footer.component';
import { MaterialModule } from '../../../material.module';

describe('CommonPageFooterComponent', () => {
  let component: CommonPageFooterComponent;
  let fixture: ComponentFixture<CommonPageFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CommonPageFooterComponent,
      ],
      imports: [MaterialModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPageFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should exist', () => {
    expect(component).toBeTruthy();
  });
});
