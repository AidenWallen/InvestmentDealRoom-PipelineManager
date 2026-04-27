import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Deal } from '../../models/deal.model';

@Component({
  selector: 'app-deal-table',
  standalone: true,
  templateUrl: './deal-table.html'
})
export class DealTable {

  @Input() deals: Deal[] = [];

  @Output() rowClick = new EventEmitter<Deal>();
  @Output() edit = new EventEmitter<Deal>();
  @Output() delete = new EventEmitter<Deal>();

  onRowClick(deal: Deal){
    this.rowClick.emit(deal);
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