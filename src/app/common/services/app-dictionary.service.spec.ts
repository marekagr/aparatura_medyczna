import { TestBed } from '@angular/core/testing';

import { AppDictionaryService } from './app-dictionary.service';

describe('AppDictionaryService', () => {
  let service: AppDictionaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppDictionaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
