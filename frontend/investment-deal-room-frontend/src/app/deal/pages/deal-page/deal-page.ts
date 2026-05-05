import { ChangeDetectorRef, Component, signal, OnInit } from '@angular/core';
import { Deal } from '../../models/deal.model';
import { DealTable } from "../../components/deal-table/deal-table";
import { buildDealForm } from "../../components/deal-form/deal.form";
import { DealService } from '../../services/deal';
import { Button, ButtonModule } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from "primeng/select";
import { DealType } from '../../models/enums/deal-type.enum';
import { PipelineStage } from '../../models/enums/pipeline-stage.enum';
import { exhaustMap, forkJoin, Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DealForm } from '../../components/deal-form/deal-form';
import { DeleteConfirmationModal } from '../../../components/delete-confirmation-modal/delete-confirmation-modal';
import { Currency } from '../../models/enums/currency.enum';

@Component({
  selector: 'app-deal-page',
  standalone: true,
  templateUrl: './deal-page.html',
  imports: [DealTable, DealForm , DialogModule, ButtonModule, 
            InputTextModule, SelectModule, FormsModule, DeleteConfirmationModal]
})
export class DealPage implements OnInit {

  allDeals = signal<Deal[]>([]);

  /** filtering signals */
  searchQuery = signal('');
  filterDealType = signal<DealType | null>(null);
  filterPipelineStage = signal<PipelineStage | null>(null);
  
  /** Enum options */
  dealTypes = Object.values(DealType);
  pipelineStages = Object.values(PipelineStage);

  showDealDialog = signal<boolean>(false);
  showDeleteDialog = signal<boolean>(false);
  selectedDeal = signal<Deal | null>(null); 

  form!: FormGroup;

  constructor(
    private dealService: DealService,
    private formBuilder: FormBuilder,
  ) {}

  
  ngOnInit() {
    this.loadAll();
    this.form = buildDealForm(this.formBuilder); 
  }


  loadAll(): void {
    forkJoin({
      deals_: this.dealService.getDeals()
    }).subscribe({
      next: ({ deals_ }) => {
        this.allDeals.set(deals_);
      },
      error: (err) => {
        console.error('Error loading data:', err);
      }
    });
  }


  saveDeal() {
    if (this.form.invalid) return;

    const {dealName, dealType, targetCompany, estimatedValue,
          currency, pipelineStage} = this.form.value;

    const dealTypeKey =  Object.entries(DealType).find(([, val]) => val === dealType)?.[0];
    const currencyKey =  Object.entries(Currency).find(([, val]) => val === currency)?.[0];


    const payload: Deal = {
		dealName,
		dealType:       dealTypeKey as DealType,
		targetCompany,
		estimatedValue,
		currency:       currencyKey as Currency,
		pipelineStage,
    };


    if (this.selectedDeal()) {
      this.dealService.updateDeal(this.selectedDeal()!.id!, payload).subscribe({
        next: (data) => {
        	this.allDeals.update(list => list.map(e => e.id === data.id ? data : e));
			this.showDealDialog.set(false);
        },
		error: (err) => { console.error(err); }
      });

    } 
	else {
		this.dealService.createDeal("test", payload).subscribe({
			next: (data) => {
				this.allDeals.update((currentList) => [...currentList, data]);
				this.showDealDialog.set(false);
			},
			error: (err) => {
				console.log(err);
			}
		});

    }
}
  

  handleCreateDeal() {
	this.selectedDeal.set(null);
	this.form.setValue({
		dealName:       null,
		dealType:       null,
		targetCompany:  null,
		estimatedValue: null,
		currency:       null,
		pipelineStage:  null,
	});
	this.showDealDialog.set(true);
  }


  handleUpdateDeal(deal: Deal) {
	this.selectedDeal.set(deal);

	this.form.setValue({
		dealName:		deal.dealName,
		dealType:		DealType[deal.dealType as string as keyof typeof  DealType],
		targetCompany:  deal.targetCompany,
		estimatedValue: deal.estimatedValue,
		currency: 		Currency[deal.currency as string as keyof typeof Currency],
    pipelineStage:  deal.pipelineStage,
	});
	this.showDealDialog.set(true);
  }




  // openModal(deal?: Deal) {
  //   this.selectedDeal = deal;
  //   this.showDealModal = true;
  // }

  // openDeleteModal(deal: Deal) {
  //   this.selectedDeal = deal;
  //   this.showDeleteModal = true;
  // }

  // closeModal() {
  //   this.showDealModal = false;
  //   this.selectedDeal = undefined;
  // }

  // closeDeleteModal() {
  //   this.showDeleteModal = false;
  //   this.selectedDeal = undefined;
  // }
  
  filteredDeals(): Deal[] {
    const query = this.searchQuery().trim().toLowerCase();
    const type = this.filterDealType();
    const stage = this.filterPipelineStage();

    return []
  }

  deleteDeal() {
    if (!this.selectedDeal() || this.selectedDeal()?.id === null) return;

    this.dealService.deleteDeal(this.selectedDeal()!.id!)
      .subscribe({
        next: () => {
          this.allDeals.update(deals => deals.filter(d => d.id !== this.selectedDeal()!.id));
          this.showDeleteDialog.set(false);
        },
        error: (err) => {
          console.log(err);
          this.showDeleteDialog.set(false);
        }
      });
       
  }

  onRowClick(deal: Deal) {
    console.log('view deal:', deal.id);
  }

  onEdit(deal: Deal) {
    this.selectedDeal.set(deal);
    this.showDealDialog.set(true);
  }

  onDelete(deal: Deal) {
    this.selectedDeal.set(deal);
    this.showDeleteDialog.set(true);
  }
}