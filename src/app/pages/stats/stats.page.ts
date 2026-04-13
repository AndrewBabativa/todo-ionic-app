import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonIcon, IonSpinner, IonBadge,
  IonItem, IonLabel, IonList, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refreshOutline, trophyOutline,
         businessOutline, serverOutline } from 'ionicons/icons';
import { FranchiseApiService, FranchiseApi } from '../../services/franchise-api.service';
import { FeatureFlagService } from '../../services/feature-flag.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton, IonIcon, IonSpinner, IonBadge,
    IonItem, IonLabel, IonList
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>📊 Estadísticas</ion-title>
        <ion-button slot="end" fill="clear" color="light" (click)="loadData()">
          <ion-icon name="refresh-outline" slot="icon-only"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- Stats locales de la app -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>📝 Mis Tareas</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">{{ taskService.totalTasks() }}</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="stat-item completed">
              <span class="stat-number">{{ taskService.completedTasks() }}</span>
              <span class="stat-label">Completadas</span>
            </div>
            <div class="stat-item pending">
              <span class="stat-number">{{ taskService.pendingTasks() }}</span>
              <span class="stat-label">Pendientes</span>
            </div>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Feature Flags -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>🚩 Feature Flags (Remote Config)</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item>
              <ion-label>Mostrar Prioridad</ion-label>
              <ion-badge slot="end"
                [color]="flagService.isEnabled('showPriority') ? 'success' : 'medium'">
                {{ flagService.isEnabled('showPriority') ? 'ON' : 'OFF' }}
              </ion-badge>
            </ion-item>
            <ion-item>
              <ion-label>Mostrar Descripción</ion-label>
              <ion-badge slot="end"
                [color]="flagService.isEnabled('showDescription') ? 'success' : 'medium'">
                {{ flagService.isEnabled('showDescription') ? 'ON' : 'OFF' }}
              </ion-badge>
            </ion-item>
            <ion-item>
              <ion-label>Búsqueda</ion-label>
              <ion-badge slot="end"
                [color]="flagService.isEnabled('enableSearch') ? 'success' : 'medium'">
                {{ flagService.isEnabled('enableSearch') ? 'ON' : 'OFF' }}
              </ion-badge>
            </ion-item>
            <ion-item>
              <ion-label>Estadísticas</ion-label>
              <ion-badge slot="end"
                [color]="flagService.isEnabled('enableStatistics') ? 'success' : 'medium'">
                {{ flagService.isEnabled('enableStatistics') ? 'ON' : 'OFF' }}
              </ion-badge>
            </ion-item>
          </ion-list>
          <ion-button expand="block" fill="outline"
            (click)="refreshFlags()" class="ion-margin-top">
            Recargar flags de Firebase
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Datos del Backend -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>🏪 Backend — Franquicias</ion-card-title>
        </ion-card-header>
        <ion-card-content>

          <div *ngIf="loading()" class="loading-container">
            <ion-spinner name="crescent"></ion-spinner>
            <p>Conectando al backend...</p>
          </div>

          <div *ngIf="backendError()" class="error-container">
            <p>⚠️ {{ backendError() }}</p>
            <ion-button expand="block" fill="outline" (click)="loadData()">
              Reintentar
            </ion-button>
          </div>

          <div *ngIf="!loading() && !backendError()">
            <p *ngIf="franchises().length === 0">
              No hay franquicias. Asegúrate de que el backend esté corriendo.
            </p>
            <ion-list>
              <ion-item *ngFor="let f of franchises()">
                <ion-icon name="business-outline" slot="start" color="primary"></ion-icon>
                <ion-label>
                  <h2>{{ f.name }}</h2>
                  <p>{{ f.branches.length }} sucursales</p>
                </ion-label>
                <ion-badge slot="end" color="primary">
                  {{ getTotalProducts(f) }} productos
                </ion-badge>
              </ion-item>
            </ion-list>
          </div>

        </ion-card-content>
      </ion-card>

    </ion-content>
  `,
  styles: [`
    .stats-grid {
      display: flex; justify-content: space-around; padding: 8px 0;
    }
    .stat-item {
      display: flex; flex-direction: column;
      align-items: center; gap: 4px;
    }
    .stat-number {
      font-size: 32px; font-weight: 700; color: var(--ion-color-primary);
    }
    .stat-item.completed .stat-number { color: var(--ion-color-success); }
    .stat-item.pending   .stat-number { color: var(--ion-color-warning); }
    .stat-label { font-size: 12px; color: var(--ion-color-medium); }
    .loading-container {
      display: flex; flex-direction: column;
      align-items: center; padding: 20px; gap: 12px;
    }
    .error-container { padding: 8px 0; }
  `]
})
export class StatsPage implements OnInit {
  taskService   = inject(TaskService);
  flagService   = inject(FeatureFlagService);
  private apiService  = inject(FranchiseApiService);
  private toastCtrl   = inject(ToastController);

  loading      = signal(false);
  backendError = signal<string | null>(null);
  franchises   = signal<FranchiseApi[]>([]);

  constructor() {
    addIcons({ refreshOutline, trophyOutline, businessOutline, serverOutline });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.backendError.set(null);

    this.apiService.getAllFranchises().subscribe({
      next: (data) => {
        this.franchises.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.backendError.set(err.message);
        this.loading.set(false);
      }
    });
  }

  async refreshFlags() {
    await this.flagService.fetchRemoteFlags();
    const toast = await this.toastCtrl.create({
      message: 'Feature flags actualizados desde Firebase ✅',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  }

  getTotalProducts(franchise: FranchiseApi): number {
    return franchise.branches.reduce((sum, b) => sum + b.products.length, 0);
  }
}