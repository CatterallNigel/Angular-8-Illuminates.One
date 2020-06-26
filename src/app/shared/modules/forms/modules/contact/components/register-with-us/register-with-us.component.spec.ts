import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegisterWithUsComponent} from './register-with-us.component';

describe('RegisterWithUsComponent', () => {
  let component: RegisterWithUsComponent;
  let fixture: ComponentFixture<RegisterWithUsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterWithUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterWithUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
