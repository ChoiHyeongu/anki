import type { FlashcardBackProps } from '../FlashcardBack/FlashcardBack.type';
import type { FlashcardFrontProps } from '../FlashcardFront/FlashcardFront.type';

export interface FlashcardProps {
  /** Content for the front of the card */
  front: FlashcardFrontProps;
  /** Content for the back of the card */
  back: FlashcardBackProps;
  /** Whether the back is currently revealed */
  isRevealed: boolean;
  /** Callback when the card is tapped to reveal */
  onReveal: () => void;
}
