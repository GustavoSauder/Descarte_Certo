import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import NotificationsPage from '../pages/NotificationsPage';
import * as notificationService from '../services/notificationService';

vi.mock('../services/notificationService');

describe('NotificationsPage', () => {
  it('deve renderizar notificações do usuário', async () => {
    notificationService.listNotifications.mockResolvedValue({ data: [
      { id: '1', title: 'Bem-vindo', message: 'Você ganhou pontos!', createdAt: new Date().toISOString(), read: false },
    ] });
    render(<NotificationsPage />);
    expect(screen.getByText(/carregando notificações/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Bem-vindo')).toBeInTheDocument());
    expect(screen.getByText('Você ganhou pontos!')).toBeInTheDocument();
  });
}); 