import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestUpsertComponent } from './test-upsert.component';

describe('TestUpsertComponent', () => {
  let component: TestUpsertComponent;
  let fixture: ComponentFixture<TestUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestUpsertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
