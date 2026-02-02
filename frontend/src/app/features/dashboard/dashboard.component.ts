import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardStats } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h1>Dashboard</h1>
      </div>

      <mat-grid-list cols="4" rowHeight="150px" gutterSize="16" *ngIf="stats">
        <mat-grid-tile>
          <mat-card class="stat-card total">
            <mat-card-content>
              <mat-icon>assignment</mat-icon>
              <h2>{{ stats.total }}</h2>
              <p>Total Tasks</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="stat-card pending">
            <mat-card-content>
              <mat-icon>pending</mat-icon>
              <h2>{{ stats.pending }}</h2>
              <p>Pending</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="stat-card in-progress">
            <mat-card-content>
              <mat-icon>autorenew</mat-icon>
              <h2>{{ stats.inProgress }}</h2>
              <p>In Progress</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="stat-card completed">
            <mat-card-content>
              <mat-icon>check_circle</mat-icon>
              <h2>{{ stats.completed }}</h2>
              <p>Completed</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>

      <mat-card class="overdue-card" *ngIf="stats && stats.overdue > 0">
        <mat-card-content>
          <mat-icon color="warn">warning</mat-icon>
          <span>You have {{ stats.overdue }} overdue task(s)</span>
          <button mat-button color="warn" routerLink="/tasks">View Tasks</button>
        </mat-card-content>
      </mat-card>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <button mat-raised-button routerLink="/tasks">
            <mat-icon>list</mat-icon>
            View All Tasks
          </button>
          <button mat-raised-button routerLink="/tasks" [queryParams]="{status: 'PENDING'}">
            <mat-icon>pending_actions</mat-icon>
            Pending Tasks
          </button>
          <button mat-raised-button routerLink="/notifications">
            <mat-icon>notifications</mat-icon>
            Notifications
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .stat-card {
      width: 100%;
      height: 100%;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .stat-card mat-card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
    }

    .stat-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 8px;
    }

    .stat-card h2 {
      font-size: 32px;
      margin: 8px 0;
      font-weight: 600;
    }

    .stat-card p {
      margin: 0;
      color: rgba(0,0,0,0.6);
    }

    .stat-card.total { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .stat-card.pending { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; }
    .stat-card.in-progress { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; }
    .stat-card.completed { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; }

    .overdue-card {
      margin: 24px 0;
      background: #fff3e0;
      border-left: 4px solid #ff9800;
    }

    .overdue-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .quick-actions {
      margin-top: 32px;
    }

    .quick-actions h2 {
      margin-bottom: 16px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .actions-grid button {
      height: 64px;
    }

    @media (max-width: 960px) {
      mat-grid-list {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }

    @media (max-width: 600px) {
      mat-grid-list {
        grid-template-columns: 1fr !important;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    const currentUser = this.authService.getCurrentUser();
    this.dashboardService.getStats(currentUser?.id).subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }
}
