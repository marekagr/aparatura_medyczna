import { TestBed } from '@angular/core/testing';

import { OpkService } from './opk.service';

describe('OpkService', () => {
  let service: OpkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
