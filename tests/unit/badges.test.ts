import { checkNewBadges, BADGES } from '@/lib/badges';

describe('Badge System', () => {
  test('awards green-starter badge after onboarding', () => {
    const userData = { onboarded: true, score: 10, completedActions: [], streak: 0 };
    const newBadges = checkNewBadges(userData, []);
    expect(newBadges).toContain('green-starter');
  });

  test('awards carbon-warrior for low footprint', () => {
    const userData = { onboarded: true, score: 3.5, completedActions: [], streak: 0 };
    const newBadges = checkNewBadges(userData, []);
    expect(newBadges).toContain('carbon-warrior');
  });

  test('does not re-award existing badges', () => {
    const userData = { onboarded: true, score: 3.5, completedActions: [], streak: 0 };
    const newBadges = checkNewBadges(userData, ['green-starter']);
    expect(newBadges).not.toContain('green-starter');
    expect(newBadges).toContain('carbon-warrior');
  });

  test('awards action-taker badge after 5 actions', () => {
    const userData = { onboarded: true, score: 10, completedActions: ['1','2','3','4','5'], streak: 0 };
    const newBadges = checkNewBadges(userData, []);
    expect(newBadges).toContain('action-taker');
  });
});
