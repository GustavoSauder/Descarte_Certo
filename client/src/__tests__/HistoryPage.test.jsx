import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import HistoryPage from '../pages/HistoryPage';
import * as disposalService from '../services/disposalService';

vi.mock('../services/disposalService');

describe('HistoryPage', () => {
  it('deve renderizar histórico de descartes', async () => {
    disposalService.listDisposals.mockResolvedValue({ data: [
      { id: '1', createdAt: '2025-06-22', materialType: 'Plástico', weight: 2, points: 10 },
    ] });
    render(<HistoryPage />);
    expect(screen.getByText(/carregando histórico/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Plástico')).toBeInTheDocument());
    expect(screen.getByText('10')).toBeInTheDocument();
  });
}); 