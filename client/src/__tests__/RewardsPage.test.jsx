import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RewardsPage from '../pages/RewardsPage';
import * as marketplaceService from '../services/marketplaceService';

vi.mock('../services/marketplaceService');

describe('RewardsPage', () => {
  it('deve renderizar recompensas e permitir resgate', async () => {
    marketplaceService.listRewards.mockResolvedValue({ data: [
      { id: '1', title: 'Copo Ecológico', description: 'Um copo sustentável', points: 100 },
      { id: '2', title: 'Camiseta', description: 'Camiseta ecológica', points: 300 },
    ] });
    marketplaceService.redeemReward.mockResolvedValue({});

    render(<RewardsPage />);
    expect(screen.getByText(/carregando recompensas/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Copo Ecológico')).toBeInTheDocument());
    fireEvent.click(screen.getAllByText('Resgatar')[0]);
    await waitFor(() => expect(marketplaceService.redeemReward).toHaveBeenCalledWith('1'));
  });
}); 