// src/app/app.component.ts — reemplaza completo
import { Component } from '@angular/core';
import { IonApp, IonTabs, IonTabBar,
         IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { listOutline, folderOutline, barChartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-app>
      <ion-tabs>
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="tasks" href="/tasks">
            <ion-icon name="list-outline"></ion-icon>
            <ion-label>Tareas</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="categories" href="/categories">
            <ion-icon name="folder-outline"></ion-icon>
            <ion-label>Categorías</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="stats" href="/stats">
            <ion-icon name="bar-chart-outline"></ion-icon>
            <ion-label>Stats</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-app>
  `
})
export class AppComponent {
  constructor() {
    addIcons({ listOutline, folderOutline, barChartOutline });
  }
}