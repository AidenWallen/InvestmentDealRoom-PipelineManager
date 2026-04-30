import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Deal } from '../../models/deal.model';
import { DealTable } from "../../components/deal-table/deal-table";
import { DealForm } from "../../components/deal-form/deal-form";
import { DealService } from '../../services/deal';
import { exhaustMap, Subject } from 'rxjs';

@Component({
  selector: 'app-deal-page',
  standalone: true,
  templateUrl: './deal-page.html',
  imports: [DealTable, DealForm]
})
export class DealPage implements OnInit {

  deals: Deal[] = [];

  showDealModal = false;
  showDeleteModal = false;

  selectedDeal: Deal | undefined;

  private submitDeal$ = new Subject<Deal>();

  constructor(
    private dealService: DealService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dealService.getDeals().subscribe(data => {
      this.deals = data;

      this.cdr.detectChanges();
    });

    this.submitDeal$
      .pipe(
        exhaustMap(deal => {

          const request$ = deal.id
            ? this.dealService.updateDeal(deal.id, {
                dealName: deal.dealName,
                dealType: deal.dealType,
                targetCompany: deal.targetCompany,
                estimatedValue: deal.estimatedValue,
                currency: deal.currency
              })
            : this.dealService.createDeal('PLACEHOLDER', deal);

          return request$;
        })
      )
      .subscribe({
        next: (res: Deal) => {

          if (this.deals.find(d => d.id === res.id)) {
            this.deals = this.deals.map(d => d.id === res.id ? res : d);
          } else {
            this.deals = [...this.deals, res];
          }

          this.closeModal();
          this.cdr.detectChanges();
        }
      });
  }

  openModal(deal?: Deal) {
    this.selectedDeal = deal;
    this.showDealModal = true;
  }

  openDeleteModal(deal: Deal) {
    this.selectedDeal = deal;
    this.showDeleteModal = true;
  }

  closeModal() {
    this.showDealModal = false;
    this.selectedDeal = undefined;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedDeal = undefined;
  }

  onSubmitDeal(deal: Deal) {
    this.submitDeal$.next(deal);
  }

  confirmDelete() {
    if (!this.selectedDeal) return;

    this.dealService.deleteDeal(this.selectedDeal.id)
      .subscribe(() => {

        this.deals = this.deals.filter(
          d => d.id !== this.selectedDeal!.id
        );

        this.closeDeleteModal();
        this.cdr.detectChanges();
      });
  }

  onCreate() {
    this.openModal(undefined);
  }

  onRowClick(deal: Deal) {
    console.log('view deal:', deal.id);
  }

  onEdit(deal: Deal) {
    this.openModal(deal);
  }

  onDelete(deal: Deal) {
    this.openDeleteModal(deal);
  }
}