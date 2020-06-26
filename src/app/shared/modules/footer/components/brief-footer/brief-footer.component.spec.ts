import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BriefFooterComponent} from './brief-footer.component';

describe('BriefFooterComponent', () => {
  let component: BriefFooterComponent;
  let fixture: ComponentFixture<BriefFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BriefFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BriefFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
