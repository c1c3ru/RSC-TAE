import * as activityService from './activityService';

describe('activityService', () => {
  it('deve buscar atividades do usuário (mock)', async () => {
    // Mock do supabaseClient ou fetch, se necessário
    const userId = 'user123';
    // Aqui você pode mockar a resposta se necessário
    const activities = await activityService.getUserActivities(userId);
    expect(Array.isArray(activities)).toBe(true);
  });
}); 