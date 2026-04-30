import { ChangeDetectorRef, Component, signal, OnInit } from '@angular/core';
import { Deal } from '../../models/deal.model';
import { DealTable } from "../../components/deal-table/deal-table";
import { DealForm } from "../../components/deal-form/deal-form";
import { DealService } from '../../services/deal';
import { Button, ButtonModule } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from "primeng/select";
import { DealType } from '../../models/enums/deal-type.enum';
import { PipelineStage } from '../../models/enums/pipeline-stage.enum';
import { exhaustMap, Subject } from 'rxjs';

@Component({
  selector: 'app-deal-page',
  standalone: true,
  templateUrl: './deal-page.html',
  imports: [DealTable, DealForm, ButtonModule, InputTextModule, SelectModule]
})
export class DealPage implements OnInit {

  deals: Deal[] = [];

  showCreateModal = false;
  /** filtering deals */
  searchQuery = signal('');
  filterActivityType = signal<DealType | null>(null);
  filterPipelineStage = signal<PipelineStage | null>(null);
  

  /** Enum options */
  dealTypes = Object.values(DealType);
  pipelineStages = Object.values(PipelineStage);

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

  filteredDeals(): Deal[] {
    const query = this.searchQuery().trim().toLowerCase();

    return this.deals.filter(deal => {
      const matchesSearch = this.searchQuery().trim() === '' || deal.dealName.toLowerCase().includes(this.searchQuery().toLowerCase());
      const matchesType = this.filterActivityType() === null || deal.dealType === this.filterActivityType();
      const matchesStage = this.filterPipelineStage() === null || deal.pipelineStage === this.filterPipelineStage();

      return matchesSearch && matchesType && matchesStage;
    });
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