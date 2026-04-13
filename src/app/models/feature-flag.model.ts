export interface FeatureFlags {
  showPriority: boolean;
  showDescription: boolean;
  enableSearch: boolean;
  enableStatistics: boolean;
}

export const DEFAULT_FLAGS: FeatureFlags = {
  showPriority: true,
  showDescription: true,
  enableSearch: true,
  enableStatistics: false,
};