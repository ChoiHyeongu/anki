import type { CardState } from './types';

export const MINUTE_MS = 60 * 1000;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}분`;
  }
  const hours = minutes / 60;
  if (hours < 24) {
    return `${hours.toFixed(1)}시간`;
  }
  return formatDays(hours / 24);
}

export function formatDays(days: number): string {
  if (days < 1) {
    return formatMinutes(days * 24 * 60);
  }
  if (days < 30) {
    return days < 2 ? `${days.toFixed(1)}일` : `${Math.round(days)}일`;
  }
  if (days < 365) {
    return `${(days / 30).toFixed(1)}개월`;
  }
  return `${(days / 365).toFixed(1)}년`;
}

export function isCardDue(state: CardState, now: number = Date.now()): boolean {
  return state.dueDate <= now;
}

export function getTimeUntilDue(state: CardState, now: number = Date.now()): number {
  return state.dueDate - now;
}

export function getTimeUntilDueFormatted(state: CardState, now: number = Date.now()): string {
  const timeMs = getTimeUntilDue(state, now);

  if (timeMs <= 0) {
    return '지금';
  }

  const minutes = timeMs / MINUTE_MS;
  if (minutes < 60) {
    return `${Math.ceil(minutes)}분 후`;
  }

  const hours = minutes / 60;
  if (hours < 24) {
    return `${Math.ceil(hours)}시간 후`;
  }

  return `${Math.ceil(hours / 24)}일 후`;
}
