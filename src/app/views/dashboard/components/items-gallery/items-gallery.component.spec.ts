import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsGalleryComponent } from './items-gallery.component';

describe('ItemsGalleryComponent', () => {
  let component: ItemsGalleryComponent;
  let fixture: ComponentFixture<ItemsGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
