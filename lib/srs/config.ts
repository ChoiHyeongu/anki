import type { SRSConfig, CardState } from './types';

export const DEFAULT_SRS_CONFIG: SRSConfig = {
  learningSteps: [1, 10],
  relearningSteps: [10],
  graduatingInterval: 1,
  easyInterval: 4,
  startingEase: 2.5,
  minimumEase: 1.3,
  easyBonus: 1.3,
  hardMultiplier: 1.2,
  lapseMultiplier: 0,
  lapseMinInterval: 1,
  maximumInterval: 36500,
  leechThreshold: 8,
};

export function createNewCardState(): CardState {
  return {
    status: 'new',
    interval: 0,
    ease: DEFAULT_SRS_CONFIG.startingEase,
    dueDate: Date.now(),
    learningStep: 0,
    lapseCount: 0,
    reviewCount: 0,
  };
}
