import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../models/task.model';

@Pipe({
  name: 'filterByCategory',
  standalone: true,
  pure: true  // ← Optimización: solo recalcula cuando el input cambia
})
export class FilterByCategoryPipe implements PipeTransform {
  transform(tasks: Task[], categoryId: string | null): Task[] {
    if (!categoryId) return tasks;
    return tasks.filter(t => t.categoryId === categoryId);
  }
}