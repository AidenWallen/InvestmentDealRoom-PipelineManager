import { Component } from '@angular/core';
import { Deal } from '../../models/deal.model';
import { DealTable } from "../../components/deal-table/deal-table";
import { DealForm } from "../../components/deal-form/deal-form";

@Component({
  selector: 'app-deal-page',
  standalone: true,
  templateUrl: './deal-page.html',
  imports: [DealTable, DealForm]
})
export class DealPage {

  deals: Deal[] = [];

  showCreateModal = false;

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

  onEdit(id: string) {
    console.log('edit deal:', id);
  }

  onDelete(id: string) {
    console.log('delete deal:', id);
  }
}