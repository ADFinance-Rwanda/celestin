import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  createTask(data: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, data);
  }

  getTasks(userId?: string, status?: TaskStatus): Observable<Task[]> {
    let params = new HttpParams();

    if (userId) {
      params = params.set('userId', userId);
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  updateTask(id: string, data: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, data);
  }

  deleteTask(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
