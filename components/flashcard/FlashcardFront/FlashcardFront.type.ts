export interface FlashcardFrontProps {
  /** Main word or term to display */
  word: string;
  /** Phonetic pronunciation */
  phonetic?: string;
  /** Callback when audio button is pressed */
  onAudioPress?: () => void;
}
