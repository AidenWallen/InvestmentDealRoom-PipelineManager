import { Component, computed, signal, OnInit } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DealTable } from '../../components/deal-table/deal-table';
import { buildDealForm } from '../../components/deal-form/deal.form';
import { DealService } from '../../../core/services/deal.service';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DealType } from '../../../shared/enums/deal-type.enum';
import { PipelineStage } from '../../../shared/enums/pipeline-stage.enum';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DealForm } from '../../components/deal-form/deal-form';
import { Currency } from '../../../shared/enums/currency.enum';
import { Deal } from '../../../shared/models/deal.model';
import { environment } from '../../../../environments/environments.development';

@Component({
  selector: 'app-deal-page',
  standalone: true,
  templateUrl: './deal-page.html',
  imports: [
    DealTable,
    DealForm,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    FormsModule,
    ProgressSpinnerModule,
  ],
})
export class DealPage implements OnInit {
  allDeals = signal<Deal[]>([]);
  isLoading = signal(true);
  loadError = signal(false);

  searchQuery = signal('');
  filterDealType = signal<string | null>(null);
  filterPipelineStage = signal<string | null>(null);

  dealTypes = Object.values(DealType);
  pipelineStages = Object.values(PipelineStage);

  showDealDialog = signal<boolean>(false);
  selectedDeal = signal<Deal | null>(null);

  form!: FormGroup;

  constructor(
    private dealService: DealService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    console.log(environment);
    this.loadAll();
    this.form = buildDealForm(this.formBuilder);
  }

  loadAll(): void {
    forkJoin({
      deals_: this.dealService.getDeals(),
    }).subscribe({
      next: ({ deals_ }) => {
        this.allDeals.set(deals_);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.isLoading.set(false);
        this.loadError.set(true);
      },
    });
  }

  saveDeal(): void {
    if (this.form.invalid) return;

    const { dealName, dealType, targetCompany, estimatedValue, currency, pipelineStage } =
      this.form.value;

    const dealTypeKey = Object.entries(DealType).find(([, val]) => val === dealType)?.[0];
    const currencyKey = Object.entries(Currency).find(([, val]) => val === currency)?.[0];
    const pipelineStageKey = Object.entries(PipelineStage).find(
      ([, val]) => val === pipelineStage,
    )?.[0];

    const payload: Deal = {
      dealName,
      dealType: dealTypeKey as DealType,
      targetCompany,
      estimatedValue,
      currency: currencyKey as Currency,
      pipelineStage: pipelineStageKey as PipelineStage,
    };

    if (this.selectedDeal()) {
      this.dealService.updateDeal(this.selectedDeal()!.id!, payload).subscribe({
        next: (data) => {
          this.allDeals.update((list) => list.map((e) => (e.id === data.id ? data : e)));
          this.showDealDialog.set(false);
        },
        error: (err) => console.error(err),
      });
    } else {
      this.dealService.createDeal(payload, this.authService.userId).subscribe({
        next: (data) => {
          this.allDeals.update((list) => [...list, data]);
          this.showDealDialog.set(false);
        },
        error: (err) => console.error(err),
      });
    }
  }

  handleCreateDeal(): void {
    this.selectedDeal.set(null);
    this.form.setValue({
      dealName: null,
      dealType: null,
      targetCompany: null,
      estimatedValue: null,
      currency: null,
      pipelineStage: null,
    });
    this.showDealDialog.set(true);
  }

  handleUpdateDeal(deal: Deal): void {
    this.selectedDeal.set(deal);
    this.form.setValue({
      dealName: deal.dealName,
      dealType: DealType[deal.dealType as string as keyof typeof DealType],
      targetCompany: deal.targetCompany,
      estimatedValue: deal.estimatedValue,
      currency: Currency[deal.currency as string as keyof typeof Currency],
      pipelineStage: deal.pipelineStage,
    });
    this.showDealDialog.set(true);
  }

  filteredDeals = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const type = this.filterDealType();
    const stage = this.filterPipelineStage();

    return this.allDeals().filter((d) => {
      const displayType = DealType[d.dealType as string as keyof typeof DealType] ?? d.dealType;
      const displayStage =
        PipelineStage[d.pipelineStage as string as keyof typeof PipelineStage] ?? d.pipelineStage;
      const matchesQuery =
        !query ||
        d.dealName?.toLowerCase().includes(query) ||
        d.targetCompany?.toLowerCase().includes(query) ||
        displayType?.toLowerCase().includes(query) ||
        displayStage?.toLowerCase().includes(query);
      const matchesType = !type || displayType === type;
      const matchesStage = !stage || displayStage === stage;
      return matchesQuery && matchesType && matchesStage;
    });
  });
}
