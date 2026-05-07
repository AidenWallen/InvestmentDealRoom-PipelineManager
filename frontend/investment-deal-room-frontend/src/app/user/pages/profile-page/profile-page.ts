import { Component, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { AuthService } from '../../../core/services/auth.service';
import { DealService } from '../../../core/services/deal.service';
import { UserService } from '../../services/user';
import { Deal } from '../../../shared/models/deal.model';
import { PipelineStage } from '../../../shared/enums/pipeline-stage.enum';
import { DealType } from '../../../shared/enums/deal-type.enum';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    SelectModule,
    DividerModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  userName = '';
  userId = '';

  editMode = signal(false);
  saving = signal(false);
  selectedDepartment = signal('');

  allDeals = signal<Deal[]>([]);
  dealsLoading = signal(true);
  dealsLoadError = signal(false);

  myDeals = computed(() => {
    const uid = this.userId;
    const deals = this.allDeals();
    if (!uid) return deals;
    return deals.filter((d) => d.assignedManagerId === uid);
  });

  readonly departments = [
    'Investment Banking',
    'Private Equity',
    'Mergers & Acquisitions',
    'Capital Markets',
    'Debt Advisory',
    'Restructuring',
    'Research & Analytics',
    'Risk Management',
    'Legal & Compliance',
  ];

  constructor(
    private authService: AuthService,
    private dealService: DealService,
    public userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.userName;
    this.userId = this.authService.userId;

    if (this.userId) {
      this.userService.loadDepartment(this.userId).subscribe({
        next: () => this.selectedDepartment.set(this.userService.department()),
        error: (err) => console.error('Failed to load department:', err),
      });
    }

    this.dealService.getDeals().subscribe({
      next: (deals) => {
        this.allDeals.set(deals);
        this.dealsLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load deals:', err);
        this.dealsLoading.set(false);
        this.dealsLoadError.set(true);
      },
    });
  }

  get initials(): string {
    if (!this.userName) return '?';
    return this.userName
      .split(' ')
      .map((n) => n[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  get displayRole(): string {
    return this.authService.role ?? 'No Role';
  }

  get displayDepartment(): string {
    return this.userService.department() || '—';
  }

  saveProfile(): void {
    if (!this.userId || !this.selectedDepartment()) {
      this.editMode.set(false);
      return;
    }
    this.saving.set(true);
    this.userService.updateDepartment(this.userId, this.selectedDepartment()).subscribe({
      next: () => {
        this.saving.set(false);
        this.editMode.set(false);
      },
      error: (err) => {
        console.error('Failed to save department:', err);
        this.saving.set(false);
      },
    });
  }

  cancelEdit(): void {
    this.selectedDepartment.set(this.userService.department());
    this.editMode.set(false);
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToDeal(deal: Deal): void {
    if (deal.id) this.router.navigate(['/deals', deal.id]);
  }

  dealTypeLabel(key: string): string {
    return DealType[key as keyof typeof DealType] ?? key;
  }

  pipelineStageLabel(key: string): string {
    return PipelineStage[key as keyof typeof PipelineStage] ?? key;
  }

  stageClass(stage: string): string {
    const base = 'text-xs px-2 py-0.5 rounded border w-fit';
    const display = PipelineStage[stage as keyof typeof PipelineStage] ?? stage;
    if (display === PipelineStage.CLOSED_WON)
      return `${base} bg-green-900/30 text-green-400 border-green-700/50`;
    if (display === PipelineStage.CLOSED_LOST)
      return `${base} bg-red-900/30 text-red-400 border-red-700/50`;
    return `${base} bg-amber-900/30 text-amber-400 border-amber-700/50`;
  }

  formatValue(value: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }
}
