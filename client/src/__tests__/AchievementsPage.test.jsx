import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AchievementsPage from '../pages/AchievementsPage';
import * as achievementService from '../services/achievementService';

vi.mock('../services/achievementService');

describe('AchievementsPage', () => {
  it('deve renderizar conquistas do usuário', async () => {
    achievementService.listAchievements.mockResolvedValue({ data: [
      { id: '1', title: 'Primeiro Descarte', description: 'Você fez seu primeiro descarte!', icon: '/icon1.png', badgeType: 'BRONZE' },
    ] });
    render(<AchievementsPage />);
    expect(screen.getByText(/carregando conquistas/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Primeiro Descarte')).toBeInTheDocument());
    expect(screen.getByText('Você fez seu primeiro descarte!')).toBeInTheDocument();
  });
}); 