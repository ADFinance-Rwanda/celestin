import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { User } from '../../../core/models/user.model';

export interface TaskDialogData {
  task?: Task;
  users: User[];
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Edit Task' : 'Create Task' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="taskForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" required>
          <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
            Title is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea
            matInput
            formControlName="description"
            rows="4"
            placeholder="Enter task description...">
          </textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width" *ngIf="isEditMode">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="PENDING">Pending</mat-option>
            <mat-option value="IN_PROGRESS">In Progress</mat-option>
            <mat-option value="COMPLETED">Completed</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Assign To</mat-label>
          <mat-select formControlName="assignedToId">
            <mat-option [value]="null">Unassigned</mat-option>
            <mat-option
              *ngFor="let user of data.users"
              [value]="user.id">
              {{ user.name }} ({{ user.email }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Due Date</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            formControlName="dueDate"
            [min]="minDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="taskForm.invalid || loading">
        <span *ngIf="!loading">{{ isEditMode ? 'Update' : 'Create' }}</span>
        <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 500px;
      padding: 20px 24px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-dialog-actions {
      padding: 16px 24px;
    }

    mat-spinner {
      margin: 0 auto;
    }

    @media (max-width: 600px) {
      mat-dialog-content {
        min-width: auto;
      }
    }
  `]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  loading = false;
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) {
    this.isEditMode = !!data.task;

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: [TaskStatus.PENDING],
      assignedToId: [null],
      dueDate: [null]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.task) {
      this.taskForm.patchValue({
        title: this.data.task.title,
        description: this.data.task.description,
        status: this.data.task.status,
        assignedToId: this.data.task.assignedToId,
        dueDate: this.data.task.dueDate ? new Date(this.data.task.dueDate) : null
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.loading = true;
      const formValue = this.taskForm.value;

      const request$ = this.isEditMode
        ? this.taskService.updateTask(this.data.task!.id, formValue)
        : this.taskService.createTask(formValue);

      request$.subscribe({
        next: () => {
          this.snackBar.open(
            `Task ${this.isEditMode ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(
            error.error?.error || 'An error occurred',
            'Close',
            { duration: 5000 }
          );
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
