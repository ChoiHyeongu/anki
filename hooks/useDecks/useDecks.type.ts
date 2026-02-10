import type { Deck } from '@/components/deck/DeckList/DeckList.type';

export interface UseDecksState {
  decks: Deck[];
  isLoading: boolean;
  error: Error | null;
}

export interface UseDecksReturn extends UseDecksState {
  /** Refresh the deck list */
  refresh: () => Promise<void>;
}
