import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../src/components/ui/Button';


describe('Button', () => {
  it('renderiza o texto corretamente', () => {
    render(<Button>Testar</Button>);
    expect(screen.getByText('Testar')).toBeInTheDocument();
  });

  it('chama onClick quando clicado', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clique</Button>);
    fireEvent.click(screen.getByText('Clique'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('mostra loading quando loading=true', () => {
    render(<Button loading>Carregando</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Carregando')).toBeInTheDocument();
  });
}); 