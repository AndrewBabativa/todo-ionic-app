import { Category } from './category.model';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  categoryId: string;
  priority: TaskPriority;
  createdAt: Date;
  completedAt?: Date;
}

export interface TaskFilter {
  categoryId?: string;
  completed?: boolean;
  priority?: TaskPriority;
  searchText?: string;
}