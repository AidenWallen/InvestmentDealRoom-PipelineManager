import { Component, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';

import { AuthService } from '../../../core/services/auth.service';
import { DealService } from '../../../core/services/deal.service';
import { UserService } from '../../services/user';
import { Deal } from '../../../shared/models/deal.model';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { PipelineStage } from '../../../shared/enums/pipeline-stage.enum';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [FormsModule, TableModule, ButtonModule, SelectModule, DividerModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {

  userName = '';
  userId = '';

  editMode = signal(false);
  selectedRole = signal<UserRole | null>(null);
  selectedDepartment = signal('');

  allDeals = signal<Deal[]>([]);

  myDeals = computed(() => {
    const uid = this.userId;
    const deals = this.allDeals();
    if (!uid) return deals;
    return deals.filter(d => d.assignedManagerId === uid);
  });

  readonly roles = Object.values(UserRole);

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
    this.selectedRole.set(this.userService.role() ?? this.authService.role);
    this.selectedDepartment.set(this.userService.department());

    this.dealService.getDeals().subscribe({
      next: (deals) => this.allDeals.set(deals),
      error: (err) => console.error('Failed to load deals:', err),
    });
  }

  get initials(): string {
    if (!this.userName) return '?';
    return this.userName
      .split(' ')
      .map(n => n[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  get displayRole(): string {
    const role = this.userService.role() ?? this.authService.role;
    if (!role) return 'No Role';
    return role === UserRole.DEAL_MANAGER ? 'Deal Manager' : role;
  }

  get displayDepartment(): string {
    return this.userService.department() || '—';
  }

  saveProfile(): void {
    if (this.selectedRole()) this.userService.setRole(this.selectedRole()!);
    this.userService.setDepartment(this.selectedDepartment());
    this.editMode.set(false);
  }

  cancelEdit(): void {
    this.selectedRole.set(this.userService.role() ?? this.authService.role);
    this.selectedDepartment.set(this.userService.department());
    this.editMode.set(false);
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToDeal(deal: Deal): void {
    if (deal.id) this.router.navigate(['/deals', deal.id]);
  }

  stageClass(stage: string): string {
    const base = 'text-xs px-2 py-0.5 rounded border w-fit';
    const map: Record<string, string> = {
      [PipelineStage.CLOSED_WON]:  `${base} bg-green-900/30 text-green-400 border-green-700/50`,
      [PipelineStage.CLOSED_LOST]: `${base} bg-red-900/30 text-red-400 border-red-700/50`,
    };
    return map[stage] ?? `${base} bg-accent-soft text-accent border-accent-strong`;
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
