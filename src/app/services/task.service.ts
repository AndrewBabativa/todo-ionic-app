import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskFilter, TaskPriority } from '../models/task.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'app_tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {

  private tasksSignal = signal<Task[]>([]);
  private filterSignal = signal<TaskFilter>({});

  filteredTasks = computed(() => {
    const tasks = this.tasksSignal();
    const filter = this.filterSignal();
    return tasks.filter(task => {
      if (filter.categoryId && task.categoryId !== filter.categoryId) return false;
      if (filter.completed !== undefined && task.completed !== filter.completed) return false;
      if (filter.priority && task.priority !== filter.priority) return false;
      if (filter.searchText) {
        const search = filter.searchText.toLowerCase();
        if (!task.title.toLowerCase().includes(search)) return false;
      }
      return true;
    });
  });

  totalTasks     = computed(() => this.tasksSignal().length);
  completedTasks = computed(() => this.tasksSignal().filter(t => t.completed).length);
  pendingTasks   = computed(() => this.tasksSignal().filter(t => !t.completed).length);

  constructor(private storage: StorageService) {
    this.loadFromStorage();
  }

  private async loadFromStorage(): Promise<void> {
    const saved = await this.storage.get<Task[]>(STORAGE_KEY);
    this.tasksSignal.set(saved ?? []);
  }

  private async saveToStorage(): Promise<void> {
    await this.storage.set(STORAGE_KEY, this.tasksSignal());
  }

  setFilter(filter: TaskFilter): void {
    this.filterSignal.set(filter);
  }

  updateFilter(partial: Partial<TaskFilter>): void {
    this.filterSignal.update(f => ({ ...f, ...partial }));
  }

  clearFilter(): void {
    this.filterSignal.set({});
  }

  async addTask(
    title: string,
    categoryId: string,
    priority: TaskPriority = 'medium',
    description?: string
  ): Promise<Task> {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description?.trim(),
      completed: false,
      categoryId,
      priority,
      createdAt: new Date()
    };
    this.tasksSignal.update(tasks => [newTask, ...tasks]);
    await this.saveToStorage();
    return newTask;
  }

  async toggleComplete(id: string): Promise<void> {
    this.tasksSignal.update(tasks =>
      tasks.map(t => t.id === id
        ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date() : undefined }
        : t
      )
    );
    await this.saveToStorage();
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    this.tasksSignal.update(tasks =>
      tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    );
    await this.saveToStorage();
  }

  async deleteTask(id: string): Promise<void> {
    this.tasksSignal.update(tasks => tasks.filter(t => t.id !== id));
    await this.saveToStorage();
  }

  async clearCompleted(): Promise<void> {
    this.tasksSignal.update(tasks => tasks.filter(t => !t.completed));
    await this.saveToStorage();
  }
}