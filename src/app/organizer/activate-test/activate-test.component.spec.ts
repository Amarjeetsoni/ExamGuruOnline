import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateTestComponent } from './activate-test.component';

describe('ActivateTestComponent', () => {
  let component: ActivateTestComponent;
  let fixture: ComponentFixture<ActivateTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivateTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
