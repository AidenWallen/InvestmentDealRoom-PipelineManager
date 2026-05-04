import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DealType } from '../../models/enums/deal-type.enum';
import { PipelineStage } from '../../models/enums/pipeline-stage.enum';
import { Deal } from '../../models/deal.model';
import { Currency } from '../../models/enums/currency.enum';

@Component({
  selector: 'app-deal-form',
  standalone: true,
  templateUrl: './deal-form.html',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, FloatLabelModule]
})
export class DealForm {
  @Input() form!: FormGroup;
  @Input() selectedDeal!: Deal | null;

  @Output() submitDeal = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  dealTypes = Object.values(DealType);
  pipelineStages = Object.values(PipelineStage);
  currencies = Object.values(Currency);

  onSubmit() {
    if (this.form.valid) {
      this.submitDeal.emit(this.form.value);
    }
  }
}