import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AchievementsPage from '../pages/AchievementsPage';
import * as achievementService from '../services/achievementService';
import { AuthProvider } from '../hooks/useAuth';
import { AppStateProvider } from '../hooks/useAppState';

vi.mock('../services/achievementService');

beforeAll(() => {
  window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    };
  };
});

beforeEach(() => {
  localStorage.setItem('authToken', 'fake-token');
});
afterEach(() => {
  localStorage.removeItem('authToken');
});

describe('AchievementsPage', () => {
  it('deve renderizar conquistas do usuário', async () => {
    achievementService.listAchievements.mockResolvedValue({ data: [
      { id: '1', title: 'Primeiro Descarte', description: 'Você fez seu primeiro descarte!', icon: '/icon1.png', badgeType: 'BRONZE' },
    ] });
    render(
      <AuthProvider>
        <AppStateProvider>
          <AchievementsPage />
        </AppStateProvider>
      </AuthProvider>
    );
    expect(screen.getByText(/carregando conquistas/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Primeiro Descarte')).toBeInTheDocument());
    expect(screen.getByText('Você fez seu primeiro descarte!')).toBeInTheDocument();
  });
}); 