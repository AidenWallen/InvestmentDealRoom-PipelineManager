import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Deal } from '../../models/deal.model';
import { DealTableRow } from "../deal-table-row/deal-table-row";

@Component({
  selector: 'app-deal-table',
  standalone: true,
  templateUrl: './deal-table.html',
  imports: [DealTableRow]
})
export class DealTable {

  @Input() deals: Deal[] = [];

  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  onEdit(id: string) {
    this.edit.emit(id);
  }

  onDelete(id: string) {
    this.delete.emit(id);
  }
}