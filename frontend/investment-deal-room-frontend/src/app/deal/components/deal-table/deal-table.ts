import { Component, Input } from '@angular/core';
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

  selectedDeal!: Deal;

  constructor(private router: Router) {}

  onRowSelect(event: any){
    this.router.navigate(['/deals', event.data.id]);
  }
}