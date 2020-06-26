import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RemoveCategoryItemsComponent} from './remove-category-items.component';

describe('RemoveCategoryItemsComponent', () => {
  let component: RemoveCategoryItemsComponent;
  let fixture: ComponentFixture<RemoveCategoryItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveCategoryItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveCategoryItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
