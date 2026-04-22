import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealPage } from './deal-page';

describe('DealPage', () => {
  let component: DealPage;
  let fixture: ComponentFixture<DealPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
