import { TestBed } from '@angular/core/testing';

import { LoginSignupServiceService } from './login-signup-service.service';

describe('LoginSignupServiceService', () => {
  let service: LoginSignupServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginSignupServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
