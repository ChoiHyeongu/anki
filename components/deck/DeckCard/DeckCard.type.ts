export interface DeckStats {
  /** Mature cards due for review (interval >= 21 days) */
  review: number;
  /** Young cards due for review (interval < 21 days) */
  young: number;
  /** Cards currently being learned */
  learning: number;
  /** New cards not yet studied */
  new: number;
}

export interface DeckDetailedStats {
  /** Total cards in the deck */
  total: number;
  /** Young cards (review status with interval < 21 days) */
  young: number;
  /** Cards that are mature (well-known, interval >= 21 days) */
  mature: number;
  /** Cards currently being learned */
  learning: number;
}

export interface DeckCardProps {
  /** Deck title */
  title: string;
  /** Today's due counts (review, learning, new) displayed on the right */
  stats: DeckStats;
  /** Detailed stats for the bottom row */
  detailedStats: DeckDetailedStats;
  /** Progress percentage (0-100) for mature cards */
  progress: number;
  /** Young progress percentage (0-100) - review cards with interval < 21 days */
  youngProgress?: number;
  /** Learning progress percentage (0-100) - shown as stacked layer */
  learningProgress?: number;
  /** Next due date timestamp (ms) for learning/relearning cards */
  nextDueDate?: number | null;
  /** Whether this deck is completed (100% mature, no cards due) */
  isCompleted?: boolean;
  /** Callback when card is pressed */
  onPress?: () => void;
}
