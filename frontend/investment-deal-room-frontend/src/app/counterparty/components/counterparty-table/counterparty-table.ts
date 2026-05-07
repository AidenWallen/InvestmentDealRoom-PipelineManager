import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';

import { Counterparty } from '../../../shared/models/counterparty.model';

@Component({
  selector: 'app-counterparty-table',
  standalone: true,
  imports: [TableModule],
  templateUrl: './counterparty-table.html',
})
export class CounterpartyTable {

  @Input() counterparties: Counterparty[] = [];
  @Input() error = false;

  constructor(private router: Router) {}

  onRowSelect(event: any): void {
    this.router.navigate(['/counterparties', event.data.id]);
  }
}
