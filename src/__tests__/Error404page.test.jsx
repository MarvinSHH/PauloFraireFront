import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Mock de react-router-dom con navigate controlado
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

import Error404Page from '../pages/error/ERROR404page.jsx';

describe('Error404Page', () => {
  it('muestra textos y botón esperados (positivo)', () => {
    render(<Error404Page />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('¡Vaya! Página no encontrada')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /volver al inicio/i })).toBeInTheDocument();
  });

  it('al hacer click llama a navigate("/") (positivo)', () => {
    navigateMock.mockClear();
    render(<Error404Page />);
    const [button] = screen.getAllByText(/volver al inicio/i);
    fireEvent.click(button);

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('no muestra códigos incorrectos ni textos inesperados (negativo)', () => {
    render(<Error404Page />);
    expect(screen.queryByText('500')).not.toBeInTheDocument();
    expect(screen.queryByText(/error interno/i)).not.toBeInTheDocument();
  });
});