import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonCheckbox, IonBadge,
         IonButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, createOutline, flagOutline } from 'ionicons/icons';
import { Task } from '../../../models/task.model';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardContent, IonCheckbox,
            IonBadge, IonButton, IonIcon, IonLabel],
  template: `
    <ion-card [class.completed]="task.completed" class="task-card">
      <ion-card-content>
        <div class="task-header">

          <ion-checkbox
            [checked]="task.completed"
            (ionChange)="onToggle.emit(task.id)"
            labelPlacement="end">
          </ion-checkbox>

          <div class="task-info">
            <p class="task-title" [class.strikethrough]="task.completed">
              {{ task.title }}
            </p>
            <p class="task-desc" *ngIf="task.description && showDescription">
              {{ task.description }}
            </p>
          </div>

          <div class="task-actions">
            <ion-button fill="clear" size="small" (click)="onEdit.emit(task)">
              <ion-icon name="create-outline" slot="icon-only"></ion-icon>
            </ion-button>
            <ion-button fill="clear" size="small" color="danger" (click)="onDelete.emit(task.id)">
              <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
            </ion-button>
          </div>
        </div>

        <div class="task-footer">
          <ion-badge *ngIf="category"
            [style.--background]="category.color"
            class="category-badge">
            {{ category.name }}
          </ion-badge>

          <ion-badge *ngIf="showPriority"
            [color]="priorityColor"
            class="priority-badge">
            {{ task.priority }}
          </ion-badge>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    .task-card { margin: 8px 0; border-radius: 12px; }
    .task-card.completed { opacity: 0.6; }
    .task-header { display: flex; align-items: flex-start; gap: 8px; }
    .task-info { flex: 1; }
    .task-title { font-weight: 600; margin: 0; font-size: 15px; }
    .task-title.strikethrough { text-decoration: line-through; color: var(--ion-color-medium); }
    .task-desc { font-size: 13px; color: var(--ion-color-medium); margin: 4px 0 0; }
    .task-actions { display: flex; }
    .task-footer { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
    .category-badge, .priority-badge { font-size: 11px; padding: 4px 8px; border-radius: 20px; }
  `]
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() category?: Category;
  @Input() showPriority = true;
  @Input() showDescription = true;
  @Output() onToggle = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onEdit   = new EventEmitter<Task>();

  constructor() {
    addIcons({ trashOutline, createOutline, flagOutline });
  }

  get priorityColor(): string {
    return { low: 'success', medium: 'warning', high: 'danger' }[this.task.priority];
  }
}