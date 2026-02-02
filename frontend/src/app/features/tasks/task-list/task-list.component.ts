import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/services/auth.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { User } from '../../../core/models/user.model';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="task-list-container">
      <div class="header">
        <h1>Tasks</h1>
        <button mat-raised-button color="primary" (click)="openTaskDialog()">
          <mat-icon>add</mat-icon>
          Create Task
        </button>
      </div>

      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Filter by Status</mat-label>
              <mat-select [formControl]="statusFilter">
                <mat-option [value]="null">All</mat-option>
                <mat-option value="PENDING">Pending</mat-option>
                <mat-option value="IN_PROGRESS">In Progress</mat-option>
                <mat-option value="COMPLETED">Completed</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Filter by User</mat-label>
              <mat-select [formControl]="userFilter">
                <mat-option [value]="null">All</mat-option>
                <mat-option
                  *ngFor="let user of users"
                  [value]="user.id">
                  {{ user.name }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Search</mat-label>
              <input matInput [formControl]="searchControl" placeholder="Search tasks...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="table-container">
        <table mat-table [dataSource]="filteredTasks" class="tasks-table">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let task">
              <div class="task-title">
                {{ task.title }}
                <span class="overdue-badge" *ngIf="isOverdue(task)">OVERDUE</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let task">
              <mat-chip [class]="'status-chip ' + task.status.toLowerCase()">
                {{ getStatusLabel(task.status) }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="assignedTo">
            <th mat-header-cell *matHeaderCellDef>Assigned To</th>
            <td mat-cell *matCellDef="let task">
              {{ task.assignedTo?.name || 'Unassigned' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="dueDate">
            <th mat-header-cell *matHeaderCellDef>Due Date</th>
            <td mat-cell *matCellDef="let task">
              {{ task.dueDate ? (task.dueDate | date: 'MMM d, y') : 'No due date' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let task">
              <button
                mat-icon-button
                color="primary"
                (click)="openTaskDialog(task)"
                matTooltip="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button
                mat-icon-button
                color="warn"
                (click)="deleteTask(task)"
                matTooltip="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" [attr.colspan]="displayedColumns.length">
              <div class="no-data">
                <mat-icon>inbox</mat-icon>
                <p>No tasks found</p>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
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

    .filters-card {
      margin-bottom: 24px;
    }

    .filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .tasks-table {
      width: 100%;
    }

    .task-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .overdue-badge {
      background: #f44336;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .status-chip {
      font-size: 12px;
      min-height: 28px;
    }

    .status-chip.pending {
      background: #ff9800;
      color: white;
    }

    .status-chip.in_progress {
      background: #2196f3;
      color: white;
    }

    .status-chip.completed {
      background: #4caf50;
      color: white;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: rgba(0,0,0,0.4);
    }

    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .tasks-table {
        font-size: 12px;
      }
    }
  `]
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  users: User[] = [];
  displayedColumns = ['title', 'status', 'assignedTo', 'dueDate', 'actions'];

  statusFilter = new FormControl<string | null>(null);
  userFilter = new FormControl<string | null>(null);
  searchControl = new FormControl('');

  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadUsers();
    this.setupFilters();
    this.checkQueryParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkQueryParams(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['status']) {
        this.statusFilter.setValue(params['status']);
      }
    });
  }

  private setupFilters(): void {
    this.statusFilter.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.applyFilters());

    this.userFilter.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.applyFilters());

    this.searchControl.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => this.applyFilters());
  }

  private loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
      },
      error: (error) => {
        this.snackBar.open('Error loading tasks', 'Close', { duration: 3000 });
      }
    });
  }

  private loadUsers(): void {
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  private applyFilters(): void {
    let filtered = [...this.tasks];

    // Status filter
    if (this.statusFilter.value) {
      filtered = filtered.filter(task => task.status === this.statusFilter.value);
    }

    // User filter
    if (this.userFilter.value) {
      filtered = filtered.filter(task => task.assignedToId === this.userFilter.value);
    }

    // Search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm)
      );
    }

    this.filteredTasks = filtered;
  }

  openTaskDialog(task?: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: { task, users: this.users }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  deleteTask(task: Task): void {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.snackBar.open('Task deleted successfully', 'Close', { duration: 3000 });
          this.loadTasks();
        },
        error: (error) => {
          this.snackBar.open('Error deleting task', 'Close', { duration: 3000 });
        }
      });
    }
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.status === TaskStatus.COMPLETED) {
      return false;
    }
    return new Date(task.dueDate) < new Date();
  }

  getStatusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
      [TaskStatus.PENDING]: 'Pending',
      [TaskStatus.IN_PROGRESS]: 'In Progress',
      [TaskStatus.COMPLETED]: 'Completed'
    };
    return labels[status];
  }
}
