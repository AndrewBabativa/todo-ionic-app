// src/app/services/feature-flag.service.ts — reemplaza completo
import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
  RemoteConfig
} from 'firebase/remote-config';
import { environment } from '../../environments/environment';
import { FeatureFlags, DEFAULT_FLAGS } from '../models/feature-flag.model';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {

  private remoteConfig: RemoteConfig;
  private flagsSignal = signal<FeatureFlags>({ ...DEFAULT_FLAGS });
  flags = this.flagsSignal.asReadonly();

  constructor() {
    // Inicializar Firebase
    const app = initializeApp(environment.firebase);
    this.remoteConfig = getRemoteConfig(app);

    // Intervalo mínimo de fetch (5 min en prod, 0 en dev)
    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: environment.production ? 300000 : 0,
      fetchTimeoutMillis: 60000
    };

    // Valores por defecto si no hay conexión
    this.remoteConfig.defaultConfig = {
      showPriority:      DEFAULT_FLAGS.showPriority,
      showDescription:   DEFAULT_FLAGS.showDescription,
      enableSearch:      DEFAULT_FLAGS.enableSearch,
      enableStatistics:  DEFAULT_FLAGS.enableStatistics,
    };

    // Cargar flags al iniciar
    this.fetchRemoteFlags();
  }

  async fetchRemoteFlags(): Promise<void> {
    try {
      // Descarga y activa los valores de Remote Config
      await fetchAndActivate(this.remoteConfig);

      // Leer cada flag
      const flags: FeatureFlags = {
        showPriority:     getValue(this.remoteConfig, 'showPriority').asBoolean(),
        showDescription:  getValue(this.remoteConfig, 'showDescription').asBoolean(),
        enableSearch:     getValue(this.remoteConfig, 'enableSearch').asBoolean(),
        enableStatistics: getValue(this.remoteConfig, 'enableStatistics').asBoolean(),
      };

      this.flagsSignal.set(flags);
      console.log('[RemoteConfig] Flags loaded:', flags);

    } catch (error) {
      console.warn('[RemoteConfig] Using default flags. Error:', error);
      this.flagsSignal.set({ ...DEFAULT_FLAGS });
    }
  }

  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flagsSignal()[flag];
  }

  // Para demo en vivo — cambiar un flag manualmente
  toggleFlag(flag: keyof FeatureFlags): void {
    this.flagsSignal.update(f => ({ ...f, [flag]: !f[flag] }));
  }
}