/**
 * Service barrel exports
 */

// Study service
export {
  getStudyQueue,
  submitRating,
  undoRating,
  canUndoRating,
  getTodaySessionSummary,
  hasDueCards,
} from './study';
export type { StudyCard, StudyQueue, SessionSummary } from './study';

// Deck service
export {
  getAllDecksWithStats,
  getDeckWithStats,
  getTotalDeckStats,
  hasAnyDueCards,
} from './deck';
export type { DeckWithStats } from './deck';
