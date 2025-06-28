import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ProfilePage from '../pages/ProfilePage';
import * as userService from '../services/userService';

vi.mock('../services/userService');

describe('ProfilePage', () => {
  it('deve renderizar dados do perfil', async () => {
    userService.getProfile.mockResolvedValue({ data: {
      name: 'João', email: 'joao@email.com', school: 'Escola X', city: 'São Paulo', state: 'SP'
    }});
    render(<ProfilePage />);
    expect(screen.getByText(/carregando perfil/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('João')).toBeInTheDocument());
    expect(screen.getByText('joao@email.com')).toBeInTheDocument();
    expect(screen.getByText('Escola X')).toBeInTheDocument();
  });
}); 