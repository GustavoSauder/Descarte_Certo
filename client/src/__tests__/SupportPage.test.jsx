import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SupportPage from '../pages/SupportPage';
import * as supportService from '../services/supportService';

vi.mock('../services/supportService');

describe('SupportPage', () => {
  it('deve renderizar tickets de suporte', async () => {
    supportService.listMyTickets.mockResolvedValue({ data: [
      { id: '1', subject: 'Ajuda', message: 'Preciso de suporte', status: 'OPEN', createdAt: new Date().toISOString() },
    ] });
    supportService.getCategories.mockResolvedValue({ data: ['Geral'] });
    render(<SupportPage />);
    expect(screen.getByText(/carregando tickets/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Ajuda')).toBeInTheDocument());
    expect(screen.getByText('Preciso de suporte')).toBeInTheDocument();
  });
}); 