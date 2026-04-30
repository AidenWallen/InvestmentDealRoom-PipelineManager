import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Deal } from '../../models/deal.model';
import { Currency } from '../../models/enums/currency.enum';
import { PipelineStage } from '../../models/enums/pipeline-stage.enum';
import { DealType } from '../../models/enums/deal-type.enum';


@Component({
  selector: 'app-deal-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './deal-form.html'
})
export class DealForm implements OnChanges {

  @Input() deal?: Deal;

  @Output() submit = new EventEmitter<Deal>();

  Currency = Currency;
  PipelineStage = PipelineStage;
  DealType = DealType;

  currencyValues = Object.values(Currency);
  pipelineStages = Object.values(PipelineStage);
  dealTypes = Object.values(DealType);

  formDeal: Deal = this.getEmptyDeal();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['deal']) {
      if (this.deal) {
        this.formDeal = { ...this.deal };
      } else {
        this.formDeal = this.getEmptyDeal();
      }
    }
  }

  onSubmitDeal() {
    this.submit.emit({ ...this.formDeal });
  }

  private getEmptyDeal(): Deal {
    return {
      id: '',
      dealName: '',
      dealType: DealType.MERGER_ACQUISITION,
      targetCompany: '',
      estimatedValue: 0,
      currency: Currency.USD,
      assignedManagerId: '',
      pipelineStage: PipelineStage.PROSPECTING
    };
  }
}