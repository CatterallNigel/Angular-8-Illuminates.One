import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuoteGenComponent} from './quote-gen.component';

describe('QuoteGenComponent', () => {
  let component: QuoteGenComponent;
  let fixture: ComponentFixture<QuoteGenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteGenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
