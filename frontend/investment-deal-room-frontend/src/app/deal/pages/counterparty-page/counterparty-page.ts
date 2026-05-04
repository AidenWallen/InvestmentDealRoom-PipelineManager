import { Component, OnInit, signal } from "@angular/core";
import { Counterparty } from "../../models/counterparty.model";
import { CounterpartyService } from "../../services/CounterpartyService";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FloatLabel, FloatLabelModule } from "primeng/floatlabel";
import { ButtonModule } from "primeng/button";
import { Dialog, DialogModule } from "primeng/dialog";
import { Select } from "primeng/select";
import { InputTextModule } from "primeng/inputtext";

  

@Component({  
    selector: 'app-counterparty-page',
    standalone: true,
    imports: [ButtonModule, DialogModule, ReactiveFormsModule, FloatLabelModule, InputTextModule],
    templateUrl: './counterparty-page.html',
})
export class CounterpartyPage implements OnInit {

  allCounterparties = signal<Counterparty[]>([]);

  // Dialog signals
  showDeleteDialog   = signal<boolean>(false);
  showFormDialog     = signal<boolean>(false);
  selectedCounterparty = signal<Counterparty | null>(null);
  
  form!: FormGroup;

  constructor(
    private counterpartyService: CounterpartyService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.loadAll();

    this.form = this.formBuilder.group({
      organizationName: [null, Validators.required],
      contactName: [null, Validators.required],
      contactEmail: [null, Validators.email],
      contactPhone: [null, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]
    });
  }

  loadAll(): void {
      this.counterpartyService.getCounterparties().subscribe({
        next: (counterparties) => {
          this.allCounterparties.set(counterparties);
        },
        error: (err) => {
          console.error('Error loading counterparties:', err);
        }
      });
  }


  handleCreate() {
    this.selectedCounterparty.set(null);
    this.form?.reset();
    this.showFormDialog.set(true);
  }

  saveCounterparty() {
    if (this.form?.invalid) {
      return;
    }
  }

  

}