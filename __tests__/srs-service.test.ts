import {
  CardState,
  DEFAULT_SRS_CONFIG,
  createNewCardState,
  calculateSRS,
  getIntervalPreviews,
  isCardDue,
  getTimeUntilDue,
  getTimeUntilDueFormatted,
  MINUTE_MS,
  HOUR_MS,
  DAY_MS,
} from '../lib/srs';

describe('SRS Service', () => {
  const config = DEFAULT_SRS_CONFIG;
  const baseTime = new Date('2024-01-15T10:00:00Z').getTime();

  describe('New Card Handling', () => {
    let newCard: CardState;

    beforeEach(() => {
      newCard = createNewCardState();
    });

    test('Again (1) - should reset to first learning step', () => {
      const result = calculateSRS(1, newCard, config, baseTime);

      expect(result.newState.status).toBe('learning');
      expect(result.newState.learningStep).toBe(0);
      expect(result.newState.dueDate).toBe(baseTime + 1 * MINUTE_MS);
      expect(result.isLeech).toBe(false);
    });

    test('Hard (2) - should stay at current step', () => {
      const result = calculateSRS(2, newCard, config, baseTime);

      expect(result.newState.status).toBe('learning');
      expect(result.newState.learningStep).toBe(0);
      expect(result.newState.dueDate).toBe(baseTime + 1 * MINUTE_MS);
    });

    test('Good (3) - should advance to next learning step', () => {
      const result = calculateSRS(3, newCard, config, baseTime);

      expect(result.newState.status).toBe('learning');
      expect(result.newState.learningStep).toBe(1);
      expect(result.newState.dueDate).toBe(baseTime + 10 * MINUTE_MS);
    });

    test('Easy (4) - should graduate immediately with easy interval', () => {
      const result = calculateSRS(4, newCard, config, baseTime);

      expect(result.newState.status).toBe('review');
      expect(result.newState.interval).toBe(4);
      expect(result.newState.dueDate).toBe(baseTime + 4 * DAY_MS);
      expect(result.newState.reviewCount).toBe(1);
    });
  });

  describe('Learning Card Handling', () => {
    test('Good (3) on last step - should graduate', () => {
      const learningCard: CardState = {
        ...createNewCardState(),
        status: 'learning',
        learningStep: 1,
      };

      const result = calculateSRS(3, learningCard, config, baseTime);

      expect(result.newState.status).toBe('review');
      expect(result.newState.interval).toBe(1);
      expect(result.newState.dueDate).toBe(baseTime + 1 * DAY_MS);
    });

    test('Again (1) - should reset to first step', () => {
      const learningCard: CardState = {
        ...createNewCardState(),
        status: 'learning',
        learningStep: 1,
      };

      const result = calculateSRS(1, learningCard, config, baseTime);

      expect(result.newState.learningStep).toBe(0);
      expect(result.newState.dueDate).toBe(baseTime + 1 * MINUTE_MS);
    });
  });

  describe('Review Card Handling', () => {
    let reviewCard: CardState;

    beforeEach(() => {
      reviewCard = {
        status: 'review',
        interval: 10,
        ease: 2.5,
        dueDate: baseTime,
        learningStep: 0,
        lapseCount: 0,
        reviewCount: 5,
      };
    });

    test('Again (1) - should lapse to relearning', () => {
      const result = calculateSRS(1, reviewCard, config, baseTime);

      expect(result.newState.status).toBe('relearning');
      expect(result.newState.learningStep).toBe(0);
      expect(result.newState.ease).toBe(2.3);
      expect(result.newState.lapseCount).toBe(1);
      expect(result.newState.dueDate).toBe(baseTime + 10 * MINUTE_MS);
    });

    test('Hard (2) - should increase interval with hard multiplier', () => {
      const result = calculateSRS(2, reviewCard, config, baseTime);

      expect(result.newState.status).toBe('review');
      expect(result.newState.interval).toBe(12);
      expect(result.newState.ease).toBe(2.35);
      expect(result.newState.reviewCount).toBe(6);
    });

    test('Good (3) - should multiply interval by ease', () => {
      const result = calculateSRS(3, reviewCard, config, baseTime);

      expect(result.newState.status).toBe('review');
      expect(result.newState.interval).toBe(25);
      expect(result.newState.ease).toBe(2.5);
      expect(result.newState.reviewCount).toBe(6);
    });

    test('Easy (4) - should multiply by ease and easy bonus', () => {
      const result = calculateSRS(4, reviewCard, config, baseTime);

      expect(result.newState.status).toBe('review');
      expect(result.newState.interval).toBe(33);
      expect(result.newState.ease).toBe(2.65);
      expect(result.newState.reviewCount).toBe(6);
    });

    test('Ease should not go below minimum', () => {
      const lowEaseCard: CardState = {
        ...reviewCard,
        ease: 1.35,
      };

      const result = calculateSRS(1, lowEaseCard, config, baseTime);

      expect(result.newState.ease).toBe(1.3);
    });

    test('Interval should not exceed maximum', () => {
      const highIntervalCard: CardState = {
        ...reviewCard,
        interval: 30000,
        ease: 2.5,
      };

      const result = calculateSRS(3, highIntervalCard, config, baseTime);

      expect(result.newState.interval).toBe(36500);
    });
  });

  describe('Relearning Card Handling', () => {
    let relearningCard: CardState;

    beforeEach(() => {
      relearningCard = {
        status: 'relearning',
        interval: 10,
        ease: 2.3,
        dueDate: baseTime,
        learningStep: 0,
        lapseCount: 1,
        reviewCount: 5,
      };
    });

    test('Again (1) - should reset to first relearning step', () => {
      const result = calculateSRS(1, relearningCard, config, baseTime);

      expect(result.newState.status).toBe('relearning');
      expect(result.newState.learningStep).toBe(0);
      expect(result.newState.dueDate).toBe(baseTime + 10 * MINUTE_MS);
    });

    test('Good (3) on last step - should return to review', () => {
      const result = calculateSRS(3, relearningCard, config, baseTime);

      expect(result.newState.status).toBe('review');
      expect(result.newState.interval).toBe(5);
      expect(result.newState.learningStep).toBe(0);
      expect(result.newState.reviewCount).toBe(6);
    });

    test('Easy (4) - should return to review with better interval', () => {
      const result = calculateSRS(4, relearningCard, config, baseTime);

      expect(result.newState.status).toBe('review');
      expect(result.newState.interval).toBe(7);
      expect(result.newState.ease).toBe(2.4);
    });
  });

  describe('Leech Detection', () => {
    test('Should detect leech when lapse count reaches threshold', () => {
      const cardNearLeech: CardState = {
        status: 'review',
        interval: 10,
        ease: 1.5,
        dueDate: baseTime,
        learningStep: 0,
        lapseCount: 7,
        reviewCount: 10,
      };

      const result = calculateSRS(1, cardNearLeech, config, baseTime);

      expect(result.newState.lapseCount).toBe(8);
      expect(result.isLeech).toBe(true);
    });

    test('Should not be leech below threshold', () => {
      const cardBelowLeech: CardState = {
        status: 'review',
        interval: 10,
        ease: 1.5,
        dueDate: baseTime,
        learningStep: 0,
        lapseCount: 6,
        reviewCount: 10,
      };

      const result = calculateSRS(1, cardBelowLeech, config, baseTime);

      expect(result.newState.lapseCount).toBe(7);
      expect(result.isLeech).toBe(false);
    });
  });

  describe('Interval Previews', () => {
    test('New card previews', () => {
      const newCard = createNewCardState();
      const previews = getIntervalPreviews(newCard, config);

      expect(previews.again).toBe('1분');
      expect(previews.hard).toBe('1분');
      expect(previews.good).toBe('10분');
      expect(previews.easy).toBe('4일');
    });

    test('Learning card on last step', () => {
      const learningCard: CardState = {
        ...createNewCardState(),
        status: 'learning',
        learningStep: 1,
      };
      const previews = getIntervalPreviews(learningCard, config);

      expect(previews.again).toBe('1분');
      expect(previews.good).toBe('1.0일');
      expect(previews.easy).toBe('4일');
    });

    test('Review card previews', () => {
      const reviewCard: CardState = {
        status: 'review',
        interval: 10,
        ease: 2.5,
        dueDate: baseTime,
        learningStep: 0,
        lapseCount: 0,
        reviewCount: 5,
      };
      const previews = getIntervalPreviews(reviewCard, config);

      expect(previews.again).toBe('10분');
      expect(previews.hard).toBe('12일');
      expect(previews.good).toBe('25일');
      expect(previews.easy).toBe('1.1개월');
    });
  });

  describe('Due Date Utilities', () => {
    test('isCardDue returns true for past due date', () => {
      const overdueCard: CardState = {
        ...createNewCardState(),
        dueDate: baseTime - HOUR_MS,
      };

      expect(isCardDue(overdueCard, baseTime)).toBe(true);
    });

    test('isCardDue returns false for future due date', () => {
      const futureCard: CardState = {
        ...createNewCardState(),
        dueDate: baseTime + HOUR_MS,
      };

      expect(isCardDue(futureCard, baseTime)).toBe(false);
    });

    test('getTimeUntilDue returns negative for overdue', () => {
      const overdueCard: CardState = {
        ...createNewCardState(),
        dueDate: baseTime - HOUR_MS,
      };

      expect(getTimeUntilDue(overdueCard, baseTime)).toBe(-HOUR_MS);
    });

    test('getTimeUntilDueFormatted shows correct format', () => {
      const cardDueIn30Min: CardState = {
        ...createNewCardState(),
        dueDate: baseTime + 30 * MINUTE_MS,
      };

      expect(getTimeUntilDueFormatted(cardDueIn30Min, baseTime)).toBe('30분 후');

      const cardDueIn2Hours: CardState = {
        ...createNewCardState(),
        dueDate: baseTime + 2 * HOUR_MS,
      };

      expect(getTimeUntilDueFormatted(cardDueIn2Hours, baseTime)).toBe('2시간 후');

      const cardDueIn3Days: CardState = {
        ...createNewCardState(),
        dueDate: baseTime + 3 * DAY_MS,
      };

      expect(getTimeUntilDueFormatted(cardDueIn3Days, baseTime)).toBe('3일 후');
    });
  });

  describe('Complete Learning Cycle', () => {
    test('New → Learning → Review cycle', () => {
      let card = createNewCardState();
      let time = baseTime;

      let result = calculateSRS(3, card, config, time);
      expect(result.newState.status).toBe('learning');
      expect(result.newState.learningStep).toBe(1);

      time += 10 * MINUTE_MS;
      card = result.newState;
      result = calculateSRS(3, card, config, time);
      expect(result.newState.status).toBe('review');
      expect(result.newState.interval).toBe(1);

      time += 1 * DAY_MS;
      card = result.newState;
      result = calculateSRS(3, card, config, time);
      expect(result.newState.status).toBe('review');
      expect(result.newState.interval).toBe(3);

      time += 3 * DAY_MS;
      card = result.newState;
      result = calculateSRS(1, card, config, time);
      expect(result.newState.status).toBe('relearning');
      expect(result.newState.lapseCount).toBe(1);

      time += 10 * MINUTE_MS;
      card = result.newState;
      result = calculateSRS(3, card, config, time);
      expect(result.newState.status).toBe('review');
      expect(result.newState.interval).toBeGreaterThanOrEqual(1);
    });
  });
});
