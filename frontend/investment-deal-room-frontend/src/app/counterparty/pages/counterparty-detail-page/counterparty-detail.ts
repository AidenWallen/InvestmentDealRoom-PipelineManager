import { Component, OnInit, computed, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationHistoryService } from '../../../core/services/navigation-history.service';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { forkJoin } from 'rxjs';

import { CounterpartyService } from '../../../core/services/counterparty.service';
import { DealService } from '../../../core/services/deal.service';
import { Counterparty } from '../../../shared/models/counterparty.model';
import { Deal } from '../../../shared/models/deal.model';
import { DealCounterpartyLink } from '../../../shared/models/deal-counterparty-link.model';
import { DealRole } from '../../../shared/enums/deal-role.enum';
import { DealType } from '../../../shared/enums/deal-type.enum';
import { PipelineStage } from '../../../shared/enums/pipeline-stage.enum';
import { DeleteConfirmationModal } from '../../../components/delete-confirmation-modal/delete-confirmation-modal';

interface LinkedDeal extends Deal {
  dealRole: DealRole;
}

@Component({
  selector: 'app-counterparty-detail',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ProgressSpinnerModule,
    DeleteConfirmationModal,
  ],
  templateUrl: './counterparty-detail.html',
})
export class CounterpartyDetail implements OnInit {
  counterparty = signal<Counterparty | null>(null);
  isLoading = signal(true);
  loadError = signal(false);
  dealLinks = signal<DealCounterpartyLink[]>([]);
  allDeals = signal<Deal[]>([]);
  editMode = signal(false);
  showDeleteDialog = signal(false);
  showLinkDialog = signal(false);
  showUnlinkDialog = signal(false);
  dealToUnlink = signal<LinkedDeal | null>(null);
  saveError = signal<string | null>(null);

  linkedDeals = computed<LinkedDeal[]>(() => {
    const links = this.dealLinks();
    const deals = this.allDeals();
    return links.reduce<LinkedDeal[]>((acc, link) => {
      const deal = deals.find((d) => d.id === link.dealId);
      if (deal)
        acc.push({
          ...deal,
          dealRole: DealRole[link.dealRole as unknown as keyof typeof DealRole] ?? link.dealRole,
        });
      return acc;
    }, []);
  });

  availableDeals = computed(() => {
    const linkedIds = new Set(this.linkedDeals().map((d) => d.id));
    return this.allDeals().filter((d) => !linkedIds.has(d.id));
  });

  dealSearch = signal('');

  filteredLinkedDeals = computed(() => {
    const query = this.dealSearch().trim().toLowerCase();
    if (!query) return this.linkedDeals();
    return this.linkedDeals().filter(
      (d) =>
        d.dealName?.toLowerCase().includes(query) ||
        d.dealType?.toLowerCase().includes(query) ||
        d.pipelineStage?.toLowerCase().includes(query) ||
        d.dealRole?.toLowerCase().includes(query),
    );
  });

  dealRoleOptions = Object.values(DealRole);

  form!: FormGroup;
  linkForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navHistory: NavigationHistoryService,
    private counterpartyService: CounterpartyService,
    private dealService: DealService,
    private formBuilder: FormBuilder,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/counterparties']);
      return;
    }

    this.form = this.formBuilder.group({
      organizationName: [null, Validators.required],
      contactName: [null, Validators.required],
      contactEmail: [null, [Validators.required, Validators.email]],
      contactPhone: [null, Validators.pattern(/^\+?[\d\s\-().]{7,15}$/)],
    });

    this.linkForm = this.formBuilder.group({
      dealId: [null, Validators.required],
      dealRole: [null, Validators.required],
    });

    this.loadAll(id);
  }

  loadAll(id: string): void {
    forkJoin({
      counterparty: this.counterpartyService.getCounterpartyById(id),
      dealLinks: this.counterpartyService.getDealsByCounterpartyId(id),
      deals: this.dealService.getDeals(),
    }).subscribe({
      next: ({ counterparty, dealLinks, deals }) => {
        this.counterparty.set(counterparty);
        this.dealLinks.set(dealLinks);
        this.allDeals.set(deals);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading counterparty detail:', err);
        this.isLoading.set(false);
        this.loadError.set(true);
      },
    });
  }

  goBack(): void {
    this.navHistory.back('/counterparties');
  }

  onDealRowSelect(event: any): void {
    this.router.navigate(['/deals', event.data.id]);
  }

  startEdit(): void {
    const cp = this.counterparty();
    if (!cp) return;
    this.form.patchValue({
      organizationName: cp.organizationName,
      contactName: cp.contactName,
      contactEmail: cp.contactEmail,
      contactPhone: cp.contactPhone,
    });
    this.editMode.set(true);
  }

  cancelEdit(): void {
    this.editMode.set(false);
    this.saveError.set(null);
    this.form.reset();
  }

  saveCounterparty(): void {
    const id = this.counterparty()?.id;
    if (this.form.invalid || !id) return;

    this.saveError.set(null);
    this.counterpartyService.updateCounterparty(id, this.form.value).subscribe({
      next: (updated) => {
        this.counterparty.set(updated);
        this.editMode.set(false);
      },
      error: (err) => {
        const message = typeof err.error === 'string' ? err.error : 'Failed to save changes.';
        this.saveError.set(message);
      },
    });
  }

  openLinkDialog(): void {
    this.linkForm.reset();
    this.showLinkDialog.set(true);
  }

  linkDeal(): void {
    const counterpartyId = this.counterparty()?.id;
    if (this.linkForm.invalid || !counterpartyId) return;

    const { dealId, dealRole } = this.linkForm.value;
    const dealRoleKey =
      Object.entries(DealRole).find(([, val]) => val === dealRole)?.[0] ?? dealRole;

    this.counterpartyService.linkCounterpartyToDeal(counterpartyId, dealId, dealRoleKey).subscribe({
      next: (link) => {
        this.dealLinks.update((links) => [...links, link]);
        this.showLinkDialog.set(false);
      },
      error: (err) => console.error('Error linking deal:', err),
    });
  }

  unlinkDeal(deal: LinkedDeal): void {
    this.dealToUnlink.set(deal);
    this.showUnlinkDialog.set(true);
  }

  confirmUnlink(): void {
    const counterpartyId = this.counterparty()?.id;
    const dealId = this.dealToUnlink()?.id;
    if (!counterpartyId || !dealId) return;

    this.counterpartyService.unlinkDeal(counterpartyId, dealId).subscribe({
      next: () => {
        this.dealLinks.update((links) => links.filter((l) => l.dealId !== dealId));
        this.showUnlinkDialog.set(false);
        this.dealToUnlink.set(null);
      },
      error: (err) => console.error('Error unlinking deal:', err),
    });
  }

  stageBadgeClass(stage: string): string {
    const base = 'text-xs px-1.5 py-0.5 rounded border w-fit';
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

  dealInitials(name: string): string {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  navigateToDeal(deal: LinkedDeal): void {
    this.router.navigate(['/deals', deal.id]);
  }

  deleteCounterparty(): void {
    const id = this.counterparty()?.id;
    if (!id) return;

    this.counterpartyService.deleteCounterparty(id).subscribe({
      next: () => this.router.navigate(['/counterparties']),
      error: (err) => console.error('Error deleting counterparty:', err),
    });
  }
}
