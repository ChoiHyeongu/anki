/**
 * Adapters barrel export
 * Type transformation utilities between DB and UI layers
 */

// Deck adapters
export {
  adaptDeckToUI,
  adaptDecksToUI,
  getTotalDueCount,
  hasDueCards,
} from './deck-adapter';

// Card adapters
export {
  adaptCardToUI,
  adaptCardsToUI,
  adaptStateToStats,
  mapStatusToType,
  formatInterval,
  mapUIRatingToSRS,
  mapSRSRatingToUI,
  adaptIntervalPreviewToUI,
} from './card-adapter';

export type { AdaptedCard } from './card-adapter';
