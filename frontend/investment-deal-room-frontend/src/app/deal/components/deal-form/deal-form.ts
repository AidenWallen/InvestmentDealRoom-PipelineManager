import { Component, EventEmitter, Output } from '@angular/core';
import { Deal } from '../../models/deal.model';
import { Currency } from '../../models/enums/currency.enum';
import { PipelineStage } from '../../models/enums/pipeline-stage.enum';
import { DealType } from '../../models/enums/deal-type.enum';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-deal-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './deal-form.html'
})
export class DealForm {

  @Output()
  create = new EventEmitter<Deal>();

  Currency = Currency;
  PipelineStage = PipelineStage;
  DealType = DealType;

  currencyValues = Object.values(Currency);
  pipelineStages = Object.values(PipelineStage);
  dealTypes = Object.values(DealType);

  deal: Deal = {
    id: '',
    dealName: '',
    dealType: DealType.M_AND_A,
    targetCompany: '',
    estimatedValue: 0,
    currency: Currency.USD,
    pipelineStage: PipelineStage.PROSPECTING
  };

  submit() {
    this.create.emit({...this.deal});

    // reset form after submit
    this.deal = {
      id: '',
      dealName: '',
      dealType: DealType.M_AND_A,
      targetCompany: '',
      estimatedValue: 0,
      currency: Currency.USD,
      pipelineStage: PipelineStage.PROSPECTING
    };
  }
}