import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PipelineStage } from '../../../shared/enums/pipeline-stage.enum';
import { DealType } from '../../../shared/enums/deal-type.enum';
import { Currency } from '../../../shared/enums/currency.enum';
import { ActivityType } from '../../../shared/enums/activity-type.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationHistoryService } from '../../../core/services/navigation-history.service';
import { DealService } from '../../../core/services/deal.service';
import { CounterpartyService } from '../../../core/services/counterparty.service';
import { ActivityFeedService } from '../../../core/services/activity-feed.service';
import { AuthService } from '../../../core/services/auth.service';
import { Counterparty } from '../../../shared/models/counterparty.model';
import { DealCounterpartyLink } from '../../../shared/models/deal-counterparty-link.model';
import { DealRole } from '../../../shared/enums/deal-role.enum';
import { DealActivity } from '../../../shared/models/deal-activity';
import { Deal } from '../../../shared/models/deal.model';
import { UpdateDealRequest } from '../../../shared/models/update-deal-request.model';
import { forkJoin } from 'rxjs';
import { DeleteConfirmationModal } from '../../../components/delete-confirmation-modal/delete-confirmation-modal';
import { buildDealForm } from '../../components/deal-form/deal.form';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';

interface LinkedCounterparty extends Counterparty {
  dealRole: DealRole;
}

@Component({
  selector: 'app-deal-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    DividerModule,
    TabsModule,
    BadgeModule,
    ProgressSpinnerModule,
    TooltipModule,
    DeleteConfirmationModal,
  ],
  templateUrl: './deal-detail.html',
})
export class DealDetail implements OnInit {
  protected readonly PipelineStage = PipelineStage;
  protected readonly ActivityType = ActivityType;

  deal = signal<Deal | null>(null);
  isLoading = signal(true);
  editMode = signal(false);
  saveError = signal<string | null>(null);

  tabs = ['Overview', 'Counterparties', 'Activity'];
  activeTab = signal<string>('Overview');

  counterpartyLinks = signal<DealCounterpartyLink[]>([]);
  allCounterparties = signal<Counterparty[]>([]);
  activities = signal<DealActivity[]>([]);

  linkedCounterparties = computed<LinkedCounterparty[]>(() => {
    const links = this.counterpartyLinks();
    const counterparties = this.allCounterparties();
    return links.reduce<LinkedCounterparty[]>((acc, link) => {
      const cp = counterparties.find((c) => c.id === link.counterpartyId);
      if (cp)
        acc.push({
          ...cp,
          dealRole: DealRole[link.dealRole as unknown as keyof typeof DealRole] ?? link.dealRole,
        });
      return acc;
    }, []);
  });

  recentActivities = computed(() => this.activities().slice(0, 5));

  counterpartySearch = signal('');

  filteredLinkedCounterparties = computed(() => {
    const query = this.counterpartySearch().trim().toLowerCase();
    if (!query) return this.linkedCounterparties();
    return this.linkedCounterparties().filter(
      (cp) =>
        cp.organizationName?.toLowerCase().includes(query) ||
        cp.contactName?.toLowerCase().includes(query) ||
        cp.contactEmail?.toLowerCase().includes(query),
    );
  });

  dealTypes = Object.values(DealType);
  currencies = Object.values(Currency);

  showLinkCounterpartyDialog = signal(false);
  showUnlinkDialog = signal(false);
  showDeleteDialog = signal(false);
  showCloseConfirmDialog = signal(false);
  pendingCloseStage = signal<PipelineStage | null>(null);
  counterpartyToUnlink = signal<LinkedCounterparty | null>(null);

  dealRoleOptions = Object.values(DealRole);

  availableCounterparties = computed(() => {
    const linkedIds = new Set(this.linkedCounterparties().map((cp) => cp.id));
    return this.allCounterparties().filter((cp) => !linkedIds.has(cp.id));
  });

  form!: FormGroup;
  linkCounterpartyForm!: FormGroup;

  readonly stageOrder = [
    PipelineStage.PROSPECTING,
    PipelineStage.DUE_DILIGENCE,
    PipelineStage.NEGOTIATION,
    PipelineStage.CLOSING,
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navHistory: NavigationHistoryService,
    private dealService: DealService,
    private counterpartyService: CounterpartyService,
    private activityFeedService: ActivityFeedService,
    public auth: AuthService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/deals']);
      return;
    }
    this.form = buildDealForm(this.formBuilder);
    this.linkCounterpartyForm = this.formBuilder.group({
      counterpartyId: [null, Validators.required],
      dealRole: [null, Validators.required],
    });
    this.loadAll(id);
  }

  private normalizeDeal(deal: Deal): Deal {
    return {
      ...deal,
      pipelineStage: (PipelineStage[deal.pipelineStage as string as keyof typeof PipelineStage] ??
        deal.pipelineStage) as PipelineStage,
      dealType: (DealType[deal.dealType as string as keyof typeof DealType] ??
        deal.dealType) as DealType,
    };
  }

  loadAll(dealId: string): void {
    this.isLoading.set(true);
    forkJoin({
      deal: this.dealService.getDealById(dealId),
      counterparties: this.counterpartyService.getCounterparties(),
      links: this.counterpartyService.getCounterpartiesByDealId(dealId),
      activities: this.activityFeedService.getActivitiesByDealId(dealId),
    }).subscribe({
      next: ({ deal, counterparties, links, activities }) => {
        this.deal.set(this.normalizeDeal(deal));
        this.allCounterparties.set(counterparties);
        this.counterpartyLinks.set(links);
        this.activities.set(activities);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading deal detail.', err);
        this.isLoading.set(false);
      },
    });
  }

  advanceStage(toStage: PipelineStage): void {
    const deal = this.deal();
    if (!deal) return;
    this.dealService.updateStage(deal.id!, toStage).subscribe({
      next: (updated) => this.deal.set(this.normalizeDeal(updated)),
      error: (err) => console.error('Stage Update Failed', err),
    });
  }

  goBack(): void {
    this.navHistory.back('/deals');
  }

  openDeleteDialog(): void {
    this.showDeleteDialog.set(true);
  }

  openCloseConfirm(stage: PipelineStage): void {
    this.pendingCloseStage.set(stage);
    this.showCloseConfirmDialog.set(true);
  }

  confirmClose(): void {
    const stage = this.pendingCloseStage();
    if (stage) this.advanceStage(stage);
    this.showCloseConfirmDialog.set(false);
    this.pendingCloseStage.set(null);
  }

  startEdit(): void {
    const deal = this.deal();
    if (!deal) return;
    this.form.patchValue({
      dealName: deal.dealName,
      dealType: DealType[deal.dealType as string as keyof typeof DealType] ?? deal.dealType,
      targetCompany: deal.targetCompany,
      estimatedValue: deal.estimatedValue,
      currency: deal.currency,
      pipelineStage: deal.pipelineStage,
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
    const dealTypeKey = (Object.entries(DealType).find(([, v]) => v === dealType)?.[0] ??
      dealType) as DealType;
    const payload: UpdateDealRequest = {
      dealName,
      dealType: dealTypeKey,
      targetCompany,
      estimatedValue,
      currency,
    };

    this.dealService.updateDeal(this.deal()!.id!, payload).subscribe({
      next: (updated) => {
        this.deal.set(this.normalizeDeal(updated));
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
      error: (err) => console.error(err),
    });
  }

  openLinkCounterpartyDialog(): void {
    this.linkCounterpartyForm.reset();
    this.showLinkCounterpartyDialog.set(true);
  }

  linkCounterparty(): void {
    const dealId = this.deal()?.id;
    if (this.linkCounterpartyForm.invalid || !dealId) return;
    const { counterpartyId, dealRole } = this.linkCounterpartyForm.value;
    const roleKey = Object.entries(DealRole).find(([, v]) => v === dealRole)?.[0] ?? dealRole;
    this.counterpartyService.linkCounterpartyToDeal(counterpartyId, dealId, roleKey).subscribe({
      next: (link) => {
        this.counterpartyLinks.update((links) => [...links, link]);
        this.showLinkCounterpartyDialog.set(false);
      },
      error: (err) => console.error('Error linking counterparty:', err),
    });
  }

  openUnlinkDialog(cp: LinkedCounterparty): void {
    this.counterpartyToUnlink.set(cp);
    this.showUnlinkDialog.set(true);
  }

  confirmUnlink(): void {
    const dealId = this.deal()?.id;
    const cpId = this.counterpartyToUnlink()?.id;
    if (!dealId || !cpId) return;
    this.counterpartyService.unlinkDeal(cpId, dealId).subscribe({
      next: () => {
        this.counterpartyLinks.update((links) => links.filter((l) => l.counterpartyId !== cpId));
        this.showUnlinkDialog.set(false);
        this.counterpartyToUnlink.set(null);
      },
      error: (err) => console.error('Error unlinking counterparty:', err),
    });
  }

  navigateToCounterparty(cp: LinkedCounterparty): void {
    this.router.navigate(['/counterparties', cp.id]);
  }

  onTabChange(value: string | number | undefined): void {
    if (value) this.activeTab.set(value as string);
  }

  isClosed = computed(() => {
    const stage = this.deal()?.pipelineStage;
    return stage === PipelineStage.CLOSED_WON || stage === PipelineStage.CLOSED_LOST;
  });

  isCurrentStage(stage: PipelineStage): boolean {
    return this.deal()?.pipelineStage === stage;
  }

  isPassedStage(stage: PipelineStage): boolean {
    const currentIdx = this.stageOrder.indexOf(
      this.deal()?.pipelineStage ?? PipelineStage.PROSPECTING,
    );
    return this.stageOrder.indexOf(stage) < currentIdx;
  }

  isRevertStage(stage: PipelineStage): boolean {
    if (!this.isStageSelectable(stage)) return false;
    const currentIdx = this.stageOrder.indexOf(
      this.deal()?.pipelineStage ?? PipelineStage.PROSPECTING,
    );
    return this.stageOrder.indexOf(stage) < currentIdx;
  }

  isStageSelectable(stage: PipelineStage): boolean {
    if (this.isClosed()) return false;
    const current = this.deal()?.pipelineStage;
    if (!current) return false;
    const allowed: Partial<Record<PipelineStage, PipelineStage[]>> = {
      [PipelineStage.PROSPECTING]: [PipelineStage.DUE_DILIGENCE],
      [PipelineStage.DUE_DILIGENCE]: [PipelineStage.PROSPECTING, PipelineStage.NEGOTIATION],
      [PipelineStage.NEGOTIATION]: [PipelineStage.DUE_DILIGENCE, PipelineStage.CLOSING],
      [PipelineStage.CLOSING]: [PipelineStage.NEGOTIATION],
    };
    return allowed[current]?.includes(stage) ?? false;
  }

  stageConnectorFilled(index: number): boolean {
    const next = this.stageOrder[index + 1];
    return !!next && (this.isPassedStage(next) || this.isCurrentStage(next));
  }

  clickStage(stage: PipelineStage): void {
    if (this.isStageSelectable(stage)) this.advanceStage(stage);
  }

  stageBubbleClass(stage: PipelineStage): string {
    const base =
      'w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-200 select-none';
    if (this.isCurrentStage(stage)) {
      return `${base} bg-accent border-accent text-white stage-current`;
    }
    if (this.isRevertStage(stage)) {
      return `${base} bg-accent border-accent text-white stage-revert`;
    }
    if (this.isPassedStage(stage)) {
      return `${base} bg-accent border-accent text-white`;
    }
    if (this.isStageSelectable(stage)) {
      return `${base} bg-surface border-border text-text-tertiary stage-advance`;
    }
    return `${base} bg-surface border-border/30 text-text-tertiary/30`;
  }

  stageTooltip(stage: PipelineStage): string | undefined {
    if (this.isRevertStage(stage)) return 'Revert';
    if (this.isStageSelectable(stage)) return 'Advance';
    return undefined;
  }

  stageLabelClass(stage: PipelineStage): string {
    if (this.isCurrentStage(stage)) return 'text-xs text-accent font-semibold';
    if (this.isPassedStage(stage)) return 'text-xs text-accent';
    if (this.isRevertStage(stage)) return 'text-xs text-text-secondary transition-colors';
    if (this.isStageSelectable(stage)) return 'text-xs text-text-secondary transition-colors';
    return 'text-xs text-text-tertiary/40';
  }

  stageBadgeClass(stage: string): string {
    const base = 'text-xs px-2 py-0.5 rounded border w-fit';
    const display = PipelineStage[stage as keyof typeof PipelineStage] ?? stage;
    if (display === PipelineStage.CLOSED_WON)
      return `${base} bg-green-900/30 text-green-400 border-green-700/50`;
    if (display === PipelineStage.CLOSED_LOST)
      return `${base} bg-red-900/30 text-red-400 border-red-700/50`;
    return `${base} bg-amber-900/30 text-amber-400 border-amber-700/50`;
  }

  dealTypeLabel(key: string): string {
    return DealType[key as keyof typeof DealType] ?? key;
  }

  pipelineStageLabel(key: string): string {
    return PipelineStage[key as keyof typeof PipelineStage] ?? key;
  }

  initials(name: string): string {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  activityDescription(activity: DealActivity): string {
    const p = activity.payload;
    switch (activity.activityType) {
      case ActivityType.STAGE_ADVANCED:
      case ActivityType.STAGE_REVERTED:
        return `${p.fromStage} → ${p.toStage}`;
      case ActivityType.COUNTERPARTY_LINKED:
        return `${p.counterpartyName} linked as ${p.counterpartyRole}`;
      case ActivityType.COUNTERPARTY_UNLINKED:
        return `${p.counterpartyName} unlinked`;
      default:
        return '';
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatCurrency(value: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency ?? 'USD',
    }).format(value);
  }
}
