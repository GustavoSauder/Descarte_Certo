import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RankingPage from '../pages/RankingPage';
import * as userService from '../services/userService';

vi.mock('../services/userService');

describe('RankingPage', () => {
  it('deve renderizar ranking de usuários', async () => {
    userService.getRanking.mockResolvedValue({ data: [
      { name: 'João', points: 1000, city: 'São Paulo' },
      { name: 'Maria', points: 900, city: 'Rio' },
    ] });
    render(<RankingPage />);
    expect(screen.getByText(/carregando ranking/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('João')).toBeInTheDocument());
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });
}); 