import { TestBed } from '@angular/core/testing';

import { UserFormsServiceService } from '../user-forms.service';

describe('UserFormsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserFormsServiceService = TestBed.get(UserFormsServiceService);
    expect(service).toBeTruthy();
  });
});
