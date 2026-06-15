import { useEcoStore } from '@/store/useEcoStore';

describe('Goals System', () => {
  beforeEach(() => {
    useEcoStore.getState().resetData();
  });

  test('adds a new goal correctly', () => {
    const goal = { id: 'test-goal', title: 'Test Goal', target: 100, current: 0, type: 'habit' as const, unit: 'km' };
    useEcoStore.getState().addGoal(goal);
    
    expect(useEcoStore.getState().user.goals).toHaveLength(1);
    expect(useEcoStore.getState().user.goals[0].title).toBe('Test Goal');
  });

  test('updates goal progress and caps at target', () => {
    const goal = { id: 'test-goal', title: 'Test Goal', target: 100, current: 50, type: 'habit' as const, unit: 'km' };
    useEcoStore.getState().addGoal(goal);
    
    useEcoStore.getState().updateGoalProgress('test-goal', 30);
    expect(useEcoStore.getState().user.goals[0].current).toBe(80);
    
    useEcoStore.getState().updateGoalProgress('test-goal', 50);
    expect(useEcoStore.getState().user.goals[0].current).toBe(100); // Capped
  });

  test('does not update other goals when updating progress', () => {
    const goal1 = { id: 'goal-1', title: 'Goal 1', target: 100, current: 0, type: 'habit' as const, unit: 'km' };
    const goal2 = { id: 'goal-2', title: 'Goal 2', target: 100, current: 0, type: 'habit' as const, unit: 'km' };
    useEcoStore.getState().addGoal(goal1);
    useEcoStore.getState().addGoal(goal2);
    
    useEcoStore.getState().updateGoalProgress('goal-1', 50);
    expect(useEcoStore.getState().user.goals[0].current).toBe(50);
    expect(useEcoStore.getState().user.goals[1].current).toBe(0);
  });

  test('resets data and adds XP correctly', () => {
    useEcoStore.getState().addXP(1500);
    expect(useEcoStore.getState().user.level).toBe(2);
    
    useEcoStore.getState().resetData();
    expect(useEcoStore.getState().user.xp).toBe(0);
    expect(useEcoStore.getState().user.level).toBe(1);
  });

  test('does not award XP for duplicate action completion', () => {
    useEcoStore.getState().completeAction('test-action', 100);
    const xpAfterFirst = useEcoStore.getState().user.xp;
    
    useEcoStore.getState().completeAction('test-action', 100);
    expect(useEcoStore.getState().user.xp).toBe(xpAfterFirst);
  });
});
