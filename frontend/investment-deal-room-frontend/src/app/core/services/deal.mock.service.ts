import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { DealType } from '../../shared/enums/deal-type.enum';
import { Currency } from '../../shared/enums/currency.enum';
import { PipelineStage } from '../../shared/enums/pipeline-stage.enum';
import { Deal } from '../../shared/models/deal.model';

@Injectable({ providedIn: 'root' })
export class MockDealService {
  private deals: Deal[] = [
    {
      id: '1',
      dealName: 'Acquisition of TechCorp',
      dealType: DealType.DEBT_ISSUANCE,
      targetCompany: 'TechCorp',
      estimatedValue: 500010000,
      currency: Currency.USD,
      pipelineStage: PipelineStage.DUE_DILIGENCE
    }
  ];
  getDealById(id: string) { return of(this.deals.find(d => d.id === id)); }
  getDeals()   { return of(this.deals); }
  createDeal(deal: any) { return of({ ...deal, id: crypto.randomUUID() }); }
  updateDeal(id: string, deal: any) { return of({ id, ...deal }); }
  deleteDeal(id: string) { return of(void 0); }
  updateStage(id: string, toStage: PipelineStage) {
   return of({ ...this.deals.find(d => d.id === id)!, pipelineStage: toStage });
  }
}