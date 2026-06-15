import { calculateStreak } from '@/lib/streaks';

describe('Streak System', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('increments streak on consecutive day', () => {
    const lastUpdate = '2026-06-14T10:00:00.000Z';
    jest.setSystemTime(new Date('2026-06-15T12:00:00.000Z'));
    
    const newStreak = calculateStreak(lastUpdate, 5);
    expect(newStreak).toBe(6);
  });

  test('maintains streak on same day', () => {
    const lastUpdate = '2026-06-15T08:00:00.000Z';
    jest.setSystemTime(new Date('2026-06-15T22:00:00.000Z'));
    
    const newStreak = calculateStreak(lastUpdate, 5);
    expect(newStreak).toBe(5);
  });

  test('resets streak if day is missed', () => {
    const lastUpdate = '2026-06-13T10:00:00.000Z';
    jest.setSystemTime(new Date('2026-06-15T12:00:00.000Z'));
    
    const newStreak = calculateStreak(lastUpdate, 5);
    expect(newStreak).toBe(1);
  });
});
