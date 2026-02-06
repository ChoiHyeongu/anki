export type DeckStatsType = 'new' | 'learning' | 'review';

export interface DeckStatsBadgeProps {
  /** Type of the stat badge */
  type: DeckStatsType;
  /** Count to display */
  count: number;
}
