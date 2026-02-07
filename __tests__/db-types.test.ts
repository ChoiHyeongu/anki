/**
 * Database Types and Mappers Tests
 */
import {
  dbProgressToCardState,
  cardStateToDbProgress,
  parseSynonyms,
  stringifySynonyms,
} from '@/lib/db/types';
import type { DbCardProgress } from '@/lib/db/types';
import type { CardState } from '@/lib/srs';

describe('Database Type Mappers', () => {
  describe('dbProgressToCardState', () => {
    it('should convert DbCardProgress to CardState', () => {
      const dbProgress: DbCardProgress = {
        card_id: 'card-1',
        status: 'learning',
        interval: 1.5,
        ease: 2.5,
        due_date: 1700000000000,
        learning_step: 1,
        lapse_count: 0,
        review_count: 5,
        last_reviewed_at: 1699999999000,
      };

      const cardState = dbProgressToCardState(dbProgress);

      expect(cardState).toEqual({
        status: 'learning',
        interval: 1.5,
        ease: 2.5,
        dueDate: 1700000000000,
        learningStep: 1,
        lapseCount: 0,
        reviewCount: 5,
      });
    });

    it('should handle new card status', () => {
      const dbProgress: DbCardProgress = {
        card_id: 'card-2',
        status: 'new',
        interval: 0,
        ease: 2.5,
        due_date: Date.now(),
        learning_step: 0,
        lapse_count: 0,
        review_count: 0,
        last_reviewed_at: null,
      };

      const cardState = dbProgressToCardState(dbProgress);

      expect(cardState.status).toBe('new');
      expect(cardState.interval).toBe(0);
      expect(cardState.learningStep).toBe(0);
    });
  });

  describe('cardStateToDbProgress', () => {
    it('should convert CardState to DbCardProgress format', () => {
      const cardState: CardState = {
        status: 'review',
        interval: 7,
        ease: 2.7,
        dueDate: 1700000000000,
        learningStep: 0,
        lapseCount: 2,
        reviewCount: 10,
      };

      const dbProgress = cardStateToDbProgress('card-1', cardState, 1699999999000);

      expect(dbProgress).toEqual({
        card_id: 'card-1',
        status: 'review',
        interval: 7,
        ease: 2.7,
        due_date: 1700000000000,
        learning_step: 0,
        lapse_count: 2,
        review_count: 10,
        last_reviewed_at: 1699999999000,
      });
    });

    it('should handle null lastReviewedAt', () => {
      const cardState: CardState = {
        status: 'new',
        interval: 0,
        ease: 2.5,
        dueDate: Date.now(),
        learningStep: 0,
        lapseCount: 0,
        reviewCount: 0,
      };

      const dbProgress = cardStateToDbProgress('card-2', cardState);

      expect(dbProgress.last_reviewed_at).toBeNull();
    });
  });

  describe('parseSynonyms', () => {
    it('should parse valid JSON array', () => {
      const synonymsJson = '["word1", "word2", "word3"]';
      const result = parseSynonyms(synonymsJson);

      expect(result).toEqual(['word1', 'word2', 'word3']);
    });

    it('should return empty array for null', () => {
      expect(parseSynonyms(null)).toEqual([]);
    });

    it('should return empty array for empty string', () => {
      expect(parseSynonyms('')).toEqual([]);
    });

    it('should return empty array for invalid JSON', () => {
      expect(parseSynonyms('not json')).toEqual([]);
    });

    it('should return empty array for malformed JSON', () => {
      expect(parseSynonyms('{"not": "array"}')).toEqual([]);
    });
  });

  describe('stringifySynonyms', () => {
    it('should stringify array to JSON', () => {
      const synonyms = ['word1', 'word2'];
      const result = stringifySynonyms(synonyms);

      expect(result).toBe('["word1","word2"]');
    });

    it('should return null for undefined', () => {
      expect(stringifySynonyms(undefined)).toBeNull();
    });

    it('should return null for empty array', () => {
      expect(stringifySynonyms([])).toBeNull();
    });
  });

  describe('roundtrip conversion', () => {
    it('should maintain data integrity through conversion cycle', () => {
      const originalState: CardState = {
        status: 'relearning',
        interval: 3.5,
        ease: 2.3,
        dueDate: 1700000000000,
        learningStep: 2,
        lapseCount: 5,
        reviewCount: 25,
      };

      const dbProgress = cardStateToDbProgress('test-card', originalState, Date.now());
      const fullDbProgress: DbCardProgress = {
        ...dbProgress,
        last_reviewed_at: dbProgress.last_reviewed_at,
      };
      const convertedBack = dbProgressToCardState(fullDbProgress);

      expect(convertedBack).toEqual(originalState);
    });

    it('should maintain synonyms through JSON roundtrip', () => {
      const originalSynonyms = ['fast', 'quick', 'rapid'];
      const json = stringifySynonyms(originalSynonyms);
      const parsed = parseSynonyms(json);

      expect(parsed).toEqual(originalSynonyms);
    });
  });
});
