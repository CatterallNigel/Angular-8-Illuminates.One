import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DisplayImageThumbsComponent} from './display-image-thumbs.component';

describe('DisplayImageThumbsComponent', () => {
  let component: DisplayImageThumbsComponent;
  let fixture: ComponentFixture<DisplayImageThumbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayImageThumbsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayImageThumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
