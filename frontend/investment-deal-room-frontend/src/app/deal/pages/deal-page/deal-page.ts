import { Component } from '@angular/core';
import { Deal } from '../../models/deal.model';
import { DealTable } from "../../components/deal-table/deal-table";
import { DealForm } from "../../components/deal-form/deal-form";
import { DealService } from '../../services/deal';

@Component({
  selector: 'app-deal-page',
  standalone: true,
  templateUrl: './deal-page.html',
  imports: [DealTable, DealForm]
})
export class DealPage {
  deals: Deal[] = [];

  showCreateModal = false;

  constructor(private dealService: DealService) {}

  ngOnInit() {
    this.dealService.getDeals().subscribe(data => {
      this.deals = data;
    });
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  onCreateDeal(deal: Deal) {
    this.deals = [
      ...this.deals,
      { ...deal, id: crypto.randomUUID() }
    ];

    this.closeCreateModal();
  }

  onRowClick(deal: Deal) {
    console.log('view deal:', deal.id);
  }

  onEdit(deal: Deal) {
    console.log('edit deal:', deal.id);
  }

  onDelete(deal: Deal) {
    console.log('delete deal:', deal.id);
  }
}