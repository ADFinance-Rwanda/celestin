import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { SocketService } from '../../../core/services/socket.service';
import { Notification } from '../../../core/models/notification.model';
import { DateAgoPipe } from '../../../shared/pipes/date-ago.pipe';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatBadgeModule,
    MatDividerModule,
    DateAgoPipe
  ],
  template: `
    <div class="notification-container">
      <div class="header">
        <h1>Notifications</h1>
        <button
          mat-raised-button
          color="primary"
          (click)="markAllAsRead()"
          [disabled]="unreadCount === 0">
          Mark All as Read
        </button>
      </div>

      <mat-card *ngIf="notifications.length === 0" class="empty-state">
        <mat-icon>notifications_none</mat-icon>
        <h2>No notifications</h2>
        <p>You're all caught up!</p>
      </mat-card>

      <mat-card class="notifications-card" *ngIf="notifications.length > 0">
        <mat-list>
          <mat-list-item
            *ngFor="let notification of notifications; let last = last"
            [class.unread]="!notification.read"
            (click)="markAsRead(notification)">
            <mat-icon matListItemIcon [color]="getIconColor(notification.type)">
              {{ getIcon(notification.type) }}
            </mat-icon>

            <div matListItemTitle class="notification-title">
              {{ notification.message }}
              <mat-icon *ngIf="!notification.read" class="unread-badge">
                fiber_manual_record
              </mat-icon>
            </div>

            <div matListItemLine class="notification-meta">
              <span class="time">{{ notification.createdAt | dateAgo }}</span>
              <span class="task-link" *ngIf="notification.task">
                <mat-icon>link</mat-icon>
                {{ notification.task.title }}
              </span>
            </div>

            <mat-divider *ngIf="!last"></mat-divider>
          </mat-list-item>
        </mat-list>
      </mat-card>
    </div>
  `,
  styles: [`
    .notification-container {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      text-align: center;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: rgba(0,0,0,0.3);
      margin-bottom: 16px;
    }

    .empty-state h2 {
      margin: 8px 0;
      color: rgba(0,0,0,0.6);
    }

    .empty-state p {
      color: rgba(0,0,0,0.4);
    }

    .notifications-card {
      padding: 0;
    }

    mat-list {
      padding: 0;
    }

    mat-list-item {
      height: auto !important;
      min-height: 72px;
      padding: 16px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    mat-list-item:hover {
      background-color: rgba(0,0,0,0.02);
    }

    mat-list-item.unread {
      background-color: #e3f2fd;
    }

    mat-list-item.unread:hover {
      background-color: #bbdefb;
    }

    .notification-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .unread-badge {
      font-size: 12px;
      width: 12px;
      height: 12px;
      color: #2196f3;
    }

    .notification-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 13px;
      color: rgba(0,0,0,0.6);
      margin-top: 4px;
    }

    .time {
      display: flex;
      align-items: center;
    }

    .task-link {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .task-link mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `]
})
export class NotificationListComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.listenToRealTimeNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.unreadCount = notifications.filter(n => !n.read).length;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  private listenToRealTimeNotifications(): void {
    this.socketService.onNotification()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notification) => {
          this.notifications.unshift(notification);
          this.unreadCount++;
        },
        error: (error) => {
          console.error('Socket notification error:', error);
        }
      });
  }

  markAsRead(notification: Notification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.read = true;
          this.unreadCount--;
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
      },
      error: (error) => {
        console.error('Error marking all as read:', error);
      }
    });
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      'TASK_ASSIGNED': 'assignment_ind',
      'TASK_STATUS_CHANGED': 'update',
      'TASK_DUE_SOON': 'schedule',
      'TASK_OVERDUE': 'warning'
    };
    return icons[type] || 'notifications';
  }

  getIconColor(type: string): string {
    const colors: Record<string, string> = {
      'TASK_ASSIGNED': 'primary',
      'TASK_STATUS_CHANGED': 'accent',
      'TASK_DUE_SOON': 'warn',
      'TASK_OVERDUE': 'warn'
    };
    return colors[type] || '';
  }
}
