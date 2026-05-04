import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Deal } from '../models/deal.model';
import { DealType } from '../models/enums/deal-type.enum';
import { Currency } from '../models/enums/currency.enum';
import { PipelineStage } from '../models/enums/pipeline-stage.enum';

@Injectable({ providedIn: 'root' })
export class MockDealService {
  private deals: Deal[] = [
    {
      id: '1',
      dealName: 'Acquisition of TechCorp',
      dealType: DealType.DEBT_ISSUANCE,
      targetCompany: 'TechCorp',
      estimatedValue: 5000000,
      currency: Currency.USD,
      pipelineStage: PipelineStage.DUE_DILIGENCE
    }
  ];

  getDeals()   { return of(this.deals); }
  createDeal(deal: any) { return of({ ...deal, id: crypto.randomUUID() }); }
  updateDeal(id: string, deal: any) { return of({ id, ...deal }); }
  deleteDeal(id: string) { return of(void 0); }
}