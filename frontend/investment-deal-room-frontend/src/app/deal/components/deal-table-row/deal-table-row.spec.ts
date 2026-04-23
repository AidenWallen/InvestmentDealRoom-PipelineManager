import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealTableRow } from './deal-table-row';

describe('DealTableRow', () => {
  let component: DealTableRow;
  let fixture: ComponentFixture<DealTableRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealTableRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealTableRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
