import {TestBed} from '@angular/core/testing';

import {Modal} from './ModalService';

describe('ModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Modal = TestBed.get(Modal);
    expect(service).toBeTruthy();
  });
});
