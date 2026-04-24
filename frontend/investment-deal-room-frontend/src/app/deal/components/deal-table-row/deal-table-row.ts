import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Deal } from '../../models/deal.model';


@Component({
  selector: 'app-deal-table-row',
  standalone: true,
  templateUrl: './deal-table-row.html'
})
export class DealTableRow {

  @Input()
  deal!: Deal;

  @Output()
  edit = new EventEmitter<string>();

  @Output()
  delete = new EventEmitter<string>();

  onEdit() {
    this.edit.emit(this.deal.id);
  }

  onDelete() {
    this.delete.emit(this.deal.id);
  }

}
