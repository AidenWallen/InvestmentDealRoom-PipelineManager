import { ChangeDetectorRef, Component, SimpleChanges } from '@angular/core';
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

  constructor(
    private dealService: DealService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dealService.getDeals().subscribe(data => {
      this.deals = data;
      this.cdr.detectChanges();
    });
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  onCreateDeal(deal: Deal) {
    this.dealService.createDeal(deal).subscribe(newDeal => {

      this.deals = [...this.deals, newDeal];

      this.closeCreateModal();
    })
  }

  onRowClick(deal: Deal) {
    console.log('view deal:', deal.id);
  }

  onEdit(deal: Deal) {

    const request = {
      dealName: deal.dealName,
      dealType: deal.dealType,
      targetCompany: deal.targetCompany,
      estimatedValue: deal.estimatedValue,
      currency: deal.currency
    };

    this.dealService
      .updateDeal(deal.id, request)
      .subscribe(updatedDeal => {

        this.deals = this.deals.map(d =>
          d.id === updatedDeal.id ? updatedDeal : d
        );

      });
  }

  onDelete(deal: Deal) {
    this.dealService.deleteDeal(deal.id).subscribe(() => {

      this.deals = this.deals.filter(d =>
        d.id !== deal.id
      );

    });
  }
}