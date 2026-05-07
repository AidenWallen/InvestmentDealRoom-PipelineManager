import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { Deal } from '../../../shared/models/deal.model';
import { DealType } from '../../../shared/enums/deal-type.enum';
import { PipelineStage } from '../../../shared/enums/pipeline-stage.enum';


@Component({
  selector: 'app-deal-table',
  standalone: true,
  imports: [TableModule],
  templateUrl: './deal-table.html'
})
export class DealTable {

  @Input() deals: Deal[] = [];
  @Input() error = false;

  selectedDeal!: Deal;

  constructor(private router: Router) {}

  onRowSelect(event: any){
    this.router.navigate(['/deals', event.data.id]);
  }

  dealTypeLabel(key: string): string {
    return DealType[key as keyof typeof DealType] ?? key;
  }

  pipelineStageLabel(key: string): string {
    return PipelineStage[key as keyof typeof PipelineStage] ?? key;
  }
}