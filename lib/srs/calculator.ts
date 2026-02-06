import type { CardState, Rating, SRSConfig, SRSResult, IntervalPreview } from './types';
import { DEFAULT_SRS_CONFIG } from './config';
import { MINUTE_MS, DAY_MS, formatMinutes, formatDays } from './utils';

export function calculateSRS(
  rating: Rating,
  currentState: CardState,
  config: SRSConfig = DEFAULT_SRS_CONFIG,
  reviewDate: number = Date.now()
): SRSResult {
  let newState: CardState;

  switch (currentState.status) {
    case 'new':
    case 'learning':
      newState = handleLearningCard(rating, currentState, config, reviewDate);
      break;
    case 'review':
      newState = handleReviewCard(rating, currentState, config, reviewDate);
      break;
    case 'relearning':
      newState = handleRelearningCard(rating, currentState, config, reviewDate);
      break;
    default:
      throw new Error(`Unknown card status: ${currentState.status}`);
  }

  return {
    newState,
    isLeech: newState.lapseCount >= config.leechThreshold,
    nextReviewDate: new Date(newState.dueDate),
  };
}

function handleLearningCard(
  rating: Rating,
  state: CardState,
  config: SRSConfig,
  reviewDate: number
): CardState {
  const steps = config.learningSteps;
  const currentStep = state.learningStep;

  switch (rating) {
    case 1:
      return {
        ...state,
        status: 'learning',
        learningStep: 0,
        dueDate: reviewDate + steps[0] * MINUTE_MS,
      };
    case 2:
      return {
        ...state,
        status: 'learning',
        dueDate: reviewDate + steps[currentStep] * MINUTE_MS,
      };
    case 3:
      if (currentStep >= steps.length - 1) {
        return graduateCard(state, config, reviewDate, false);
      }
      return {
        ...state,
        status: 'learning',
        learningStep: currentStep + 1,
        dueDate: reviewDate + steps[currentStep + 1] * MINUTE_MS,
      };
    case 4:
      return graduateCard(state, config, reviewDate, true);
    default:
      throw new Error(`Invalid rating: ${rating}`);
  }
}

function handleReviewCard(
  rating: Rating,
  state: CardState,
  config: SRSConfig,
  reviewDate: number
): CardState {
  const { interval, ease } = state;

  switch (rating) {
    case 1: {
      return {
        ...state,
        status: 'relearning',
        learningStep: 0,
        ease: Math.max(config.minimumEase, ease - 0.2),
        lapseCount: state.lapseCount + 1,
        dueDate: reviewDate + config.relearningSteps[0] * MINUTE_MS,
      };
    }
    case 2: {
      const hardInterval = Math.min(
        Math.max(interval * config.hardMultiplier, interval + 1),
        config.maximumInterval
      );
      return {
        ...state,
        interval: Math.round(hardInterval),
        ease: Math.max(config.minimumEase, ease - 0.15),
        reviewCount: state.reviewCount + 1,
        dueDate: reviewDate + hardInterval * DAY_MS,
      };
    }
    case 3: {
      const goodInterval = Math.min(interval * ease, config.maximumInterval);
      return {
        ...state,
        interval: Math.round(goodInterval),
        reviewCount: state.reviewCount + 1,
        dueDate: reviewDate + goodInterval * DAY_MS,
      };
    }
    case 4: {
      const easyInterval = Math.min(interval * ease * config.easyBonus, config.maximumInterval);
      return {
        ...state,
        interval: Math.round(easyInterval),
        ease: ease + 0.15,
        reviewCount: state.reviewCount + 1,
        dueDate: reviewDate + easyInterval * DAY_MS,
      };
    }
    default:
      throw new Error(`Invalid rating: ${rating}`);
  }
}

function handleRelearningCard(
  rating: Rating,
  state: CardState,
  config: SRSConfig,
  reviewDate: number
): CardState {
  const steps = config.relearningSteps;
  const currentStep = state.learningStep;

  switch (rating) {
    case 1:
      return {
        ...state,
        learningStep: 0,
        dueDate: reviewDate + steps[0] * MINUTE_MS,
      };
    case 2:
      return {
        ...state,
        dueDate: reviewDate + steps[currentStep] * MINUTE_MS,
      };
    case 3:
      if (currentStep >= steps.length - 1) {
        return {
          ...state,
          status: 'review',
          interval: Math.max(config.lapseMinInterval, Math.round(state.interval * 0.5)),
          learningStep: 0,
          reviewCount: state.reviewCount + 1,
          dueDate: reviewDate + config.lapseMinInterval * DAY_MS,
        };
      }
      return {
        ...state,
        learningStep: currentStep + 1,
        dueDate: reviewDate + steps[currentStep + 1] * MINUTE_MS,
      };
    case 4: {
      const easyLapseInterval = Math.max(config.lapseMinInterval, Math.round(state.interval * 0.7));
      return {
        ...state,
        status: 'review',
        interval: easyLapseInterval,
        learningStep: 0,
        ease: state.ease + 0.1,
        reviewCount: state.reviewCount + 1,
        dueDate: reviewDate + easyLapseInterval * DAY_MS,
      };
    }
    default:
      throw new Error(`Invalid rating: ${rating}`);
  }
}

function graduateCard(
  state: CardState,
  config: SRSConfig,
  reviewDate: number,
  isEasy: boolean
): CardState {
  const interval = isEasy ? config.easyInterval : config.graduatingInterval;
  return {
    ...state,
    status: 'review',
    interval,
    learningStep: 0,
    reviewCount: state.reviewCount + 1,
    dueDate: reviewDate + interval * DAY_MS,
  };
}

export function getIntervalPreviews(
  currentState: CardState,
  config: SRSConfig = DEFAULT_SRS_CONFIG
): IntervalPreview {
  const { status, interval, ease, learningStep } = currentState;

  switch (status) {
    case 'new':
    case 'learning': {
      const steps = config.learningSteps;
      const currentStepMinutes = steps[learningStep] || steps[0];
      const nextStepMinutes = steps[learningStep + 1];

      return {
        again: formatMinutes(steps[0]),
        hard: formatMinutes(currentStepMinutes),
        good: nextStepMinutes ? formatMinutes(nextStepMinutes) : formatDays(config.graduatingInterval),
        easy: formatDays(config.easyInterval),
      };
    }
    case 'review': {
      const hardInterval = Math.min(
        Math.max(interval * config.hardMultiplier, interval + 1),
        config.maximumInterval
      );
      const goodInterval = Math.min(interval * ease, config.maximumInterval);
      const easyInterval = Math.min(interval * ease * config.easyBonus, config.maximumInterval);

      return {
        again: formatMinutes(config.relearningSteps[0]),
        hard: formatDays(hardInterval),
        good: formatDays(goodInterval),
        easy: formatDays(easyInterval),
      };
    }
    case 'relearning': {
      const steps = config.relearningSteps;
      const currentStepMinutes = steps[learningStep] || steps[0];
      const lapseInterval = Math.max(config.lapseMinInterval, Math.round(interval * 0.5));
      const easyLapseInterval = Math.max(config.lapseMinInterval, Math.round(interval * 0.7));

      return {
        again: formatMinutes(steps[0]),
        hard: formatMinutes(currentStepMinutes),
        good:
          learningStep >= steps.length - 1
            ? formatDays(lapseInterval)
            : formatMinutes(steps[learningStep + 1] || currentStepMinutes),
        easy: formatDays(easyLapseInterval),
      };
    }
    default:
      return { again: '-', hard: '-', good: '-', easy: '-' };
  }
}
