import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { Deal } from '../../../shared/models/deal.model';


@Component({
  selector: 'app-deal-table',
  standalone: true,
  imports: [TableModule],
  templateUrl: './deal-table.html'
})
export class DealTable {

  @Input() deals: Deal[] = [];

  @Output() rowClick = new EventEmitter<Deal>();
  @Output() edit = new EventEmitter<Deal>();
  @Output() delete = new EventEmitter<Deal>();

  selectedDeal!: Deal;

  constructor(private router: Router) {}

  onRowSelect(event: any){
    this.router.navigate(['/deals', event.data.id]);
  }

  onEdit(event: MouseEvent, deal: Deal) {
    event.stopPropagation();
    this.edit.emit(deal);
  }

  onDelete(event: MouseEvent, deal: Deal) {
    event.stopPropagation();
    this.delete.emit(deal);
  }
}