export type CardStatus = 'new' | 'learning' | 'review' | 'relearning';

export type Rating = 1 | 2 | 3 | 4;

export interface SRSConfig {
  learningSteps: number[];
  relearningSteps: number[];
  graduatingInterval: number;
  easyInterval: number;
  startingEase: number;
  minimumEase: number;
  easyBonus: number;
  hardMultiplier: number;
  lapseMultiplier: number;
  lapseMinInterval: number;
  maximumInterval: number;
  leechThreshold: number;
}

export interface CardState {
  status: CardStatus;
  interval: number;
  ease: number;
  dueDate: number;
  learningStep: number;
  lapseCount: number;
  reviewCount: number;
}

export interface SRSResult {
  newState: CardState;
  isLeech: boolean;
  nextReviewDate: Date;
}

export interface IntervalPreview {
  again: string;
  hard: string;
  good: string;
  easy: string;
}
