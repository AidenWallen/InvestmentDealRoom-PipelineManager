import { CommonModule } from "@angular/common";
import { Component, computed, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { SelectModule } from "primeng/select";
import { DividerModule }    from 'primeng/divider';
import { PrimeIcons } from "primeng/api";
import { PipelineStage } from "../../../shared/enums/pipeline-stage.enum";
import { ActivatedRoute, Router } from "@angular/router";
import { DealService } from "../../../core/services/deal.service";
import { CounterpartyService } from "../../../core/services/counterparty.service";
import { AuthService } from "../../../core/services/auth.service";
import { ActivityFeedService } from "../../../core/services/activity-feed.service";
import { Counterparty } from "../../../shared/models/counterparty.model";
import { DealActivity } from "../../../shared/models/deal-activity";
import { Deal } from "../../../shared/models/deal.model";
import { forkJoin } from "rxjs";
import { StepsModule } from 'primeng/steps';
import { TagModule } from 'primeng/tag';
import { DeleteConfirmationModal } from "../../../components/delete-confirmation-modal/delete-confirmation-modal";
import { buildDealForm } from "../../components/deal-form/deal.form";
import { DealForm } from "../../components/deal-form/deal-form";
import { DealType } from "../../../shared/enums/deal-type.enum";
import { Currency } from "../../../shared/enums/currency.enum";
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from "primeng/badge";



@Component({
  selector: 'app-deal-detail',
  standalone: true,
  imports: [
    CommonModule,ButtonModule,DialogModule,DividerModule,SelectModule,FormsModule, DeleteConfirmationModal, StepsModule,
	TagModule, DealForm, TabsModule, BadgeModule
  ],
  templateUrl: './deal-detail.html',
})
export class DealDetail implements OnInit {

	protected readonly PipelineStage = PipelineStage;
	deal = signal<Deal | null>(null);

	// icons
	editIcon  = PrimeIcons.PENCIL;
	trashIcon = PrimeIcons.TRASH;
	backIcon  = PrimeIcons.ARROW_LEFT;
	userIcon  = PrimeIcons.USER;
	linkIcon  = PrimeIcons.LINK;

	tabs = ['Overview', 'Counterparties', 'Activity'];
	activeTab = signal<string>('Overview');
	
	// linkedCounterparties    = signal<DealCounterparty[]>([]);
	availableCounterparties = signal <Counterparty[]>([]);
	activities              = signal<DealActivity[]>([])

	//dialog signals
	showEditDialog			   = signal<boolean>(false);
	showLinkCounterpartyDialog = signal<boolean>(false);
	showStageDialog			   = signal<boolean>(false);
	showDeleteDialog		   = signal<boolean>(false);

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
		private route:               ActivatedRoute,
		private router:              Router,
		private dealService:         DealService,
		private counterpartyService: CounterpartyService,
		private activityFeedService:     ActivityFeedService,
		public  auth:                AuthService,
		private formBuilder:		FormBuilder,
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

		const fromStage = deal.pipelineStage;

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
		this.router.navigate(['/deals']);
	}

	openDeleteDialog(): void {
		this.showDeleteDialog.set(true);
	}

	saveDeal(): void {
		if (!this.form.valid || !this.deal()?.id) return;

		this.dealService.updateDeal(this.deal()!.id!, this.form.value).subscribe({
			next: (updated) => {this.deal.set(updated),
				this.showEditDialog.set(false);
			},
			error: (err) => console.error(err)
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

	handleUpdateDeal() {
		const deal = this.deal();
		if (!deal) {
			console.log("ERORR", deal);
			return;
		}

		this.form.patchValue({
			dealName:		deal.dealName,
			dealType:		deal.dealType,
			targetCompany:  deal.targetCompany,
			estimatedValue: deal.estimatedValue,
			currency: 		deal.currency,
		});
		this.showEditDialog.set(true);
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

	formatCurrency(value: number, currency: string): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency', currency: currency ?? 'USD'
		}).format(value);
 	}


}