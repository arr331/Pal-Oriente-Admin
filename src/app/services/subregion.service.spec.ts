import { TestBed } from '@angular/core/testing';

import { SubregionService } from './subregion.service';

describe('SubregionService', () => {
  let service: SubregionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubregionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
