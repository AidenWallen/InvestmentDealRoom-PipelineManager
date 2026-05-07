import { Component, OnInit, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CounterpartyService } from '../../../core/services/counterparty.service';
import { Counterparty } from '../../../shared/models/counterparty.model';
import { CounterpartyTable } from '../../components/counterparty-table/counterparty-table';

@Component({
  selector: 'app-counterparty-page',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule,
    ButtonModule, DialogModule,
    FloatLabelModule, InputTextModule,
    CounterpartyTable,
  ],
  templateUrl: './counterparty-page.html',
})
export class CounterpartyPage implements OnInit {

  allCounterparties = signal<Counterparty[]>([]);
  searchQuery = signal('');

  filteredCounterparties = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return this.allCounterparties();
    return this.allCounterparties().filter(c =>
      c.organizationName?.toLowerCase().includes(query) ||
      c.contactName?.toLowerCase().includes(query) ||
      c.contactEmail?.toLowerCase().includes(query) ||
      c.contactPhone?.toLowerCase().includes(query)
    );
  });

  showFormDialog       = signal(false);
  showDeleteDialog     = signal(false);
  selectedCounterparty = signal<Counterparty | null>(null);
  createError          = signal<string | null>(null);

  form!: FormGroup;

  constructor(
    private counterpartyService: CounterpartyService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.form = this.formBuilder.group({
      organizationName: [null, Validators.required],
      contactName:      [null, Validators.required],
      contactEmail:     [null, [Validators.required, Validators.email]],
      contactPhone:     [null, Validators.pattern(/^\+?[\d\s\-().]{7,15}$/)],
    });
  }

  loadAll(): void {
    this.counterpartyService.getCounterparties().subscribe({
      next: (list) => this.allCounterparties.set(list),
      error: (err) => console.error('Error loading counterparties:', err),
    });
  }

  handleCreate(): void {
    this.selectedCounterparty.set(null);
    this.createError.set(null);
    this.form.reset();
    this.showFormDialog.set(true);
  }

  saveCounterparty(): void {
    if (this.form.invalid) return;

    const payload: Counterparty = this.form.value;

    this.counterpartyService.createCounterparty(payload).subscribe({
      next: (created) => {
        this.allCounterparties.update(list => [...list, created]);
        this.showFormDialog.set(false);
      },
      error: (err) => {
        const message = typeof err.error === 'string' ? err.error : 'Failed to create counterparty.';
        this.createError.set(message);
      },
    });
  }
}
