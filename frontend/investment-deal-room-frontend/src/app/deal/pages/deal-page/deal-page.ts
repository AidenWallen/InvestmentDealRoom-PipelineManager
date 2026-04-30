import { Component, signal, SimpleChanges } from '@angular/core';
import { Deal } from '../../models/deal.model';
import { DealTable } from "../../components/deal-table/deal-table";
import { DealForm } from "../../components/deal-form/deal-form";
import { DealService } from '../../services/deal';
import { Button, ButtonModule } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from "primeng/select";
import { DealType } from '../../models/enums/deal-type.enum';
import { PipelineStage } from '../../models/enums/pipeline-stage.enum';

@Component({
  selector: 'app-deal-page',
  standalone: true,
  templateUrl: './deal-page.html',
  imports: [DealTable, DealForm, ButtonModule, InputTextModule, SelectModule]
})
export class DealPage {
  deals: Deal[] = [];
  
  showCreateModal = false;

  /** filtering deals */
  searchQuery = signal('');
  filterActivtityType = signal<DealType | null>(null);
  filterPilelineStage = signal<PipelineStage | null>(null);
  

  /** Enum options */
  dealTypes = Object.values(DealType);
  pipelineStages = Object.values(PipelineStage);

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

  filteredDeals(): Deal[] {
    const query = this.searchQuery().trim().toLowerCase();

    return this.deals.filter(deal => {
      const matchesSearch = this.searchQuery().trim() === '' || deal.dealName.toLowerCase().includes(this.searchQuery().toLowerCase());
      const matchesType = this.filterActivtityType() === null || deal.dealType === this.filterActivtityType();
      const matchesStage = this.filterPilelineStage() === null || deal.pipelineStage === this.filterPilelineStage();

      return matchesSearch && matchesType && matchesStage;
    });
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