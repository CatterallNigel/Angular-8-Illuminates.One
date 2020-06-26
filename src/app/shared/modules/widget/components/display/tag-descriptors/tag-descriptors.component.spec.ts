import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TagDescriptorsComponent} from './tag-descriptors.component';

describe('TagDescriptorsComponent', () => {
  let component: TagDescriptorsComponent;
  let fixture: ComponentFixture<TagDescriptorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagDescriptorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagDescriptorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
