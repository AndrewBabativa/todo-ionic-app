import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./pages/tasks/tasks.page').then(m => m.TasksPage)
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/categories/categories.page').then(m => m.CategoriesPage)
  },
  {
    path: 'stats',
    loadComponent: () =>
      import('./pages/stats/stats.page').then(m => m.StatsPage)
  }
];