import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealTable } from './deal-table';

describe('DealTable', () => {
  let component: DealTable;
  let fixture: ComponentFixture<DealTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealTable],
    }).compileComponents();

    fixture = TestBed.createComponent(DealTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
