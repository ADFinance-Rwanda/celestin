import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary" *ngIf="currentUser$ | async as user">
      <span class="logo" routerLink="/dashboard">Task Manager</span>

      <span class="spacer"></span>

      <button mat-button routerLink="/dashboard">
        <mat-icon>dashboard</mat-icon>
        Dashboard
      </button>

      <button mat-button routerLink="/tasks">
        <mat-icon>task</mat-icon>
        Tasks
      </button>

      <button
        mat-icon-button
        routerLink="/notifications"
        [matBadge]="unreadCount$ | async"
        [matBadgeHidden]="(unreadCount$ | async) === 0"
        matBadgeColor="warn">
        <mat-icon>notifications</mat-icon>
      </button>

      <button mat-button [matMenuTriggerFor]="menu">
        <mat-icon>account_circle</mat-icon>
        {{ user.name }}
      </button>

      <mat-menu #menu="matMenu">
        <button mat-menu-item disabled>
          <mat-icon>email</mat-icon>
          <span>{{ user.email }}</span>
        </button>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .logo {
      cursor: pointer;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .spacer {
      flex: 1 1 auto;
    }

    button {
      margin: 0 4px;
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser$: Observable<User | null>;
  unreadCount$: Observable<number>;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.unreadCount$ = this.notificationService.unreadCount$;
  }

  ngOnInit(): void {
    // Load initial unread count
    this.notificationService.getNotifications().subscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}
