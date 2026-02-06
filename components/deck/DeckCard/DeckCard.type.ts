export interface DeckStats {
  /** Cards due for review (mature cards) */
  review: number;
  /** Cards currently being learned */
  learning: number;
  /** New cards not yet studied */
  new: number;
}

export interface DeckDetailedStats {
  /** Total cards in the deck */
  total: number;
  /** Cards that are mature (well-known) */
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
  /** Learning progress percentage (0-100) - shown as stacked layer */
  learningProgress?: number;
  /** Whether this deck is completed (100% mature, no cards due) */
  isCompleted?: boolean;
  /** Callback when card is pressed */
  onPress?: () => void;
}
