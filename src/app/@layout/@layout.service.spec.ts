import { inject, TestBed } from '@angular/core/testing';

import { LayoutService } from './@layout.service';

describe('@layoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayoutService]
    });
  });

  it('should be created', inject([LayoutService], (service: LayoutService) => {
    expect(service).toBeTruthy();
  }));
});
