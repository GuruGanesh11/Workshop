import { TestBed } from '@angular/core/testing';

import { PostWorkshopService } from './post-workshop.service';

describe('PostWorkshopService', () => {
  let service: PostWorkshopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostWorkshopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
