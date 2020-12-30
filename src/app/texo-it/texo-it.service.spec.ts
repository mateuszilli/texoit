import { TestBed } from '@angular/core/testing';

import { TexoItService } from './texo-it.service';

describe('TexoItService', () => {
  let service: TexoItService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TexoItService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
