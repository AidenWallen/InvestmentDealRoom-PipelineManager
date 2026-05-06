import { CommonModule } from "@angular/common";
import { Component, computed, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { DividerModule } from 'primeng/divider';
import { PipelineStage } from "../../../shared/enums/pipeline-stage.enum";
import { DealType } from "../../../shared/enums/deal-type.enum";
import { Currency } from "../../../shared/enums/currency.enum";
import { ActivatedRoute, Router } from "@angular/router";
import { NavigationHistoryService } from "../../../core/services/navigation-history.service";
import { DealService } from "../../../core/services/deal.service";
import { AuthService } from "../../../core/services/auth.service";
import { Counterparty } from "../../../shared/models/counterparty.model";
import { DealActivity } from "../../../shared/models/deal-activity";
import { Deal } from "../../../shared/models/deal.model";
import { UpdateDealRequest } from "../../../shared/models/update-deal-request.model";
import { forkJoin } from "rxjs";
import { StepsModule } from 'primeng/steps';
import { TagModule } from 'primeng/tag';
import { DeleteConfirmationModal } from "../../../components/delete-confirmation-modal/delete-confirmation-modal";
import { buildDealForm } from "../../components/deal-form/deal.form";
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from "primeng/badge";



@Component({
  selector: 'app-deal-detail',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    ButtonModule, DialogModule, InputTextModule, SelectModule, DividerModule,
    StepsModule, TagModule, TabsModule, BadgeModule,
    DeleteConfirmationModal,
  ],
  templateUrl: './deal-detail.html',
})
export class DealDetail implements OnInit {

	protected readonly PipelineStage = PipelineStage;
	deal = signal<Deal | null>(null);

	editMode  = signal(false);
	saveError = signal<string | null>(null);

	tabs      = ['Overview', 'Counterparties', 'Activity'];
	activeTab = signal<string>('Overview');

	availableCounterparties = signal<Counterparty[]>([]);
	activities              = signal<DealActivity[]>([]);

	dealTypes  = Object.values(DealType);
	currencies = Object.values(Currency);

	showLinkCounterpartyDialog = signal<boolean>(false);
	showDeleteDialog           = signal<boolean>(false);

	selectedCounterPartyId		= signal<string | null>(null);
	selectedStage				= signal<PipelineStage | null>(null)

	form!: FormGroup;

	allStages 					= Object.values(PipelineStage);

	recentActivities = computed(() => this.activities().slice(0,5));

	// Provides all the stage options to stepper as 
	pipelineStages = [...Object.values(PipelineStage)
		.filter(s => s !== PipelineStage.CLOSED_WON && s !== PipelineStage.CLOSED_LOST)
		.map((s,i) => ({ label: s , command: () => this.onStageChange(i)}))];


	// Helper variable to handle stage changes in the UI
	readonly stageOrder = [
        PipelineStage.PROSPECTING,
        PipelineStage.DUE_DILIGENCE,
        PipelineStage.NEGOTIATION,
        PipelineStage.CLOSING,
    ];


	constructor(
		private route:      ActivatedRoute,
		private router:     Router,
		private navHistory: NavigationHistoryService,
		private dealService: DealService,
		public  auth:        AuthService,
		private formBuilder: FormBuilder,
	) {}


	ngOnInit(): void {
		const id = this.route.snapshot.paramMap.get('id');
		if (!id) { this.router.navigate(['/deals']); return; }

		this.form = buildDealForm(this.formBuilder); 
		this.loadAll(id);
	}


	loadAll(dealId: string): void {

		forkJoin({
			deal: 				this.dealService.getDealById(dealId),
			//counterparties:		this.counterpartyService.getCounterparties(),
			//activities: 		this.activityFeedService.getActivitiesByDeal(dealId);

		}).subscribe({	
			next: ({deal}) => {
				console.log(deal.id);
				this.deal.set(deal);
				//this.availableCounterparties.set(counterparties);
			},
			error: (err) => {
				console.error('Error loading deal detail.', err);
			}
		});
	}


	advanceStage(toStage: PipelineStage): void {
		const deal = this.deal();
		if (!deal) return;

		this.dealService.updateStage(deal.id!, toStage).subscribe({
			next: (updated) => this.deal.set(updated),
			error: (err) => console.error("Stage Update Failed", err)
		});
	}

	
	/**
	 * 
	 * Helper Methods
	 * 
	 */

	goBack(): void {
		this.navHistory.back('/deals');
	}

	openDeleteDialog(): void {
		this.showDeleteDialog.set(true);
	}

	startEdit(): void {
		const deal = this.deal();
		if (!deal) return;
		this.form.patchValue({
			dealName:       deal.dealName,
			dealType:       DealType[deal.dealType as string as keyof typeof DealType] ?? deal.dealType,
			targetCompany:  deal.targetCompany,
			estimatedValue: deal.estimatedValue,
			currency:       deal.currency,
			pipelineStage:  deal.pipelineStage,
		});
		this.saveError.set(null);
		this.editMode.set(true);
	}

	cancelEdit(): void {
		this.editMode.set(false);
		this.saveError.set(null);
		this.form.reset();
	}

	saveDeal(): void {
		if (!this.form.valid || !this.deal()?.id) return;

		this.saveError.set(null);
		const { dealName, dealType, targetCompany, estimatedValue, currency } = this.form.value;
		const dealTypeKey = (Object.entries(DealType).find(([, v]) => v === dealType)?.[0] ?? dealType) as DealType;
		const payload: UpdateDealRequest = { dealName, dealType: dealTypeKey, targetCompany, estimatedValue, currency };

		this.dealService.updateDeal(this.deal()!.id!, payload).subscribe({
			next: (updated) => {
				this.deal.set(updated);
				this.editMode.set(false);
			},
			error: (err) => {
				const message = typeof err.error === 'string' ? err.error : 'Failed to save changes.';
				this.saveError.set(message);
			},
		});
	}

	deleteDeal(): void {
		const id = this.deal()?.id;
		if (!id) return;

		this.dealService.deleteDeal(id).subscribe({
			next: () => this.router.navigate(['/deals']),
			error: (err) => console.error(err)
		});
	}

	onTabChange(value: string | number | undefined): void {
		if (value) this.activeTab.set(value as string);
	}

	/** For updating UI Pipeline stage changes */

	get activeIndex(): number {
		const idx = this.stageOrder.indexOf(this.deal()!.pipelineStage);
		return idx == -1 ? 3 : idx;
	}

	onStageChange(index: number): void {
		const toStage = this.stageOrder[index];
		if (toStage) this.advanceStage(toStage);
	}

	isClosed = computed(() => {
		const stage = this.deal()?.pipelineStage;
		return stage === PipelineStage.CLOSED_WON || stage === PipelineStage.CLOSED_LOST;
	});


	/** Used for formatting output */

	dealTypeLabel(key: string): string {
		return DealType[key as keyof typeof DealType] ?? key;
	}

	formatCurrency(value: number, currency: string): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency', currency: currency ?? 'USD'
		}).format(value);
 	}


}