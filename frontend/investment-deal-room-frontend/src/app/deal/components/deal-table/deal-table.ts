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
  templateUrl: './deal-table.html',
})
export class DealTable {
  @Input() deals: Deal[] = [];
  @Input() error = false;

  selectedDeal!: Deal;

  constructor(private router: Router) {}

  onRowSelect(event: any) {
    this.router.navigate(['/deals', event.data.id]);
  }

  dealTypeLabel(key: string): string {
    return DealType[key as keyof typeof DealType] ?? key;
  }

  pipelineStageLabel(key: string): string {
    return PipelineStage[key as keyof typeof PipelineStage] ?? key;
  }

  stageBadgeClass(stage: string): string {
    const base = 'text-xs px-2 py-0.5 rounded border w-fit';
    const display = PipelineStage[stage as keyof typeof PipelineStage] ?? stage;
    if (display === PipelineStage.CLOSED_WON)
      return `${base} bg-green-900/30 text-green-400 border-green-700/50`;
    if (display === PipelineStage.CLOSED_LOST)
      return `${base} bg-red-900/30 text-red-400 border-red-700/50`;
    return `${base} bg-amber-900/30 text-amber-400 border-amber-700/50`;
  }
}
