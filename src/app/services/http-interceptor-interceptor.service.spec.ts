import { TestBed } from '@angular/core/testing';

import { HttpInterceptorInterceptorService } from './http-interceptor-interceptor.service';

describe('HttpInterceptorInterceptorService', () => {
  let service: HttpInterceptorInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpInterceptorInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
