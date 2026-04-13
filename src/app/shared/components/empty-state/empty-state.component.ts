import { Component, Input } from '@angular/core';
import { IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IonIcon, IonText],
  template: `
    <div class="empty-container">
      <ion-icon [name]="icon" class="empty-icon"></ion-icon>
      <ion-text color="medium">
        <h3>{{ title }}</h3>
        <p>{{ subtitle }}</p>
      </ion-text>
    </div>
  `,
  styles: [`
    .empty-container {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 60px 20px; text-align: center;
    }
    .empty-icon { font-size: 72px; color: var(--ion-color-medium); margin-bottom: 16px; }
    h3 { font-size: 18px; font-weight: 600; margin: 0 0 8px; }
    p  { font-size: 14px; margin: 0; }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'list-outline';
  @Input() title = 'No hay tareas';
  @Input() subtitle = 'Agrega tu primera tarea';
  constructor() { addIcons({ checkmarkCircleOutline, listOutline }); }
}