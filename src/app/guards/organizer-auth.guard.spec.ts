import { TestBed } from '@angular/core/testing';

import { OrganizerAuthGuard } from './organizer-auth.guard';

describe('OrganizerAuthGuard', () => {
  let guard: OrganizerAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OrganizerAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
