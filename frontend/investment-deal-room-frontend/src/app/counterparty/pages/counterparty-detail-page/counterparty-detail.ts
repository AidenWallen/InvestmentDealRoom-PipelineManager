import { Component, OnInit, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { forkJoin } from 'rxjs';

import { CounterpartyService } from '../../../core/services/counterparty.service';
import { DealService } from '../../../core/services/deal.service';
import { Counterparty } from '../../../shared/models/counterparty.model';
import { Deal } from '../../../shared/models/deal.model';
import { DealCounterpartyLink } from '../../../shared/models/deal-counterparty-link.model';
import { DealRole } from '../../../shared/enums/deal-role.enum';
import { DeleteConfirmationModal } from '../../../components/delete-confirmation-modal/delete-confirmation-modal';

interface LinkedDeal extends Deal {
  dealRole: DealRole;
}

@Component({
  selector: 'app-counterparty-detail',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule,
    ButtonModule, DialogModule, InputTextModule, SelectModule, TableModule,
    DeleteConfirmationModal,
  ],
  templateUrl: './counterparty-detail.html',
})
export class CounterpartyDetail implements OnInit {

  counterparty     = signal<Counterparty | null>(null);
  dealLinks        = signal<DealCounterpartyLink[]>([]);
  allDeals         = signal<Deal[]>([]);
  editMode         = signal(false);
  showDeleteDialog = signal(false);
  showLinkDialog   = signal(false);

  linkedDeals = computed<LinkedDeal[]>(() => {
    const links = this.dealLinks();
    const deals = this.allDeals();
    return links.reduce<LinkedDeal[]>((acc, link) => {
      const deal = deals.find(d => d.id === link.dealId);
      if (deal) acc.push({ ...deal, dealRole: link.dealRole });
      return acc;
    }, []);
  });

  availableDeals = computed(() => {
    const linkedIds = new Set(this.linkedDeals().map(d => d.id));
    return this.allDeals().filter(d => !linkedIds.has(d.id));
  });

  dealSearch = signal('');

  filteredLinkedDeals = computed(() => {
    const query = this.dealSearch().trim().toLowerCase();
    if (!query) return this.linkedDeals();
    return this.linkedDeals().filter(d =>
      d.dealName?.toLowerCase().includes(query) ||
      d.dealType?.toLowerCase().includes(query) ||
      d.pipelineStage?.toLowerCase().includes(query) ||
      d.dealRole?.toLowerCase().includes(query)
    );
  });

  dealRoleOptions = Object.values(DealRole);

  form!:     FormGroup;
  linkForm!: FormGroup;

  constructor(
    private route:               ActivatedRoute,
    private router:              Router,
    private counterpartyService: CounterpartyService,
    private dealService:         DealService,
    private formBuilder:         FormBuilder,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/counterparties']); return; }

    this.form = this.formBuilder.group({
      organizationName: [null, Validators.required],
      contactName:      [null, Validators.required],
      contactEmail:     [null, [Validators.required, Validators.email]],
      contactPhone:     [null, Validators.pattern(/^\+?[\d\s\-().]{7,15}$/)],
    });

    this.linkForm = this.formBuilder.group({
      dealId:   [null, Validators.required],
      dealRole: [null, Validators.required],
    });

    this.loadAll(id);
  }

  loadAll(id: string): void {
    forkJoin({
      counterparty: this.counterpartyService.getCounterpartyById(id),
      dealLinks:    this.counterpartyService.getDealsByCounterpartyId(id),
      deals:        this.dealService.getDeals(),
    }).subscribe({
      next: ({ counterparty, dealLinks, deals }) => {
        this.counterparty.set(counterparty);
        this.dealLinks.set(dealLinks);
        this.allDeals.set(deals);
      },
      error: (err) => console.error('Error loading counterparty detail:', err),
    });
  }

  goBack(): void {
    this.router.navigate(['/counterparties']);
  }

  onDealRowSelect(event: any): void {
    this.router.navigate(['/deals', event.data.id]);
  }

  startEdit(): void {
    const cp = this.counterparty();
    if (!cp) return;
    this.form.patchValue({
      organizationName: cp.organizationName,
      contactName:      cp.contactName,
      contactEmail:     cp.contactEmail,
      contactPhone:     cp.contactPhone,
    });
    this.editMode.set(true);
  }

  cancelEdit(): void {
    this.editMode.set(false);
    this.form.reset();
  }

  saveCounterparty(): void {
    const id = this.counterparty()?.id;
    if (this.form.invalid || !id) return;

    this.counterpartyService.updateCounterparty(id, this.form.value).subscribe({
      next: (updated) => {
        this.counterparty.set(updated);
        this.editMode.set(false);
      },
      error: (err) => console.error('Error updating counterparty:', err),
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

    this.counterpartyService.linkCounterpartyToDeal(counterpartyId, dealId, dealRole).subscribe({
      next: (link) => {
        this.dealLinks.update(links => [...links, link]);
        this.showLinkDialog.set(false);
      },
      error: (err) => console.error('Error linking deal:', err),
    });
  }

  deleteCounterparty(): void {
    const id = this.counterparty()?.id;
    if (!id) return;

    this.counterpartyService.deleteCounterparty(id).subscribe({
      next:  ()    => this.router.navigate(['/counterparties']),
      error: (err) => console.error('Error deleting counterparty:', err),
    });
  }
}
