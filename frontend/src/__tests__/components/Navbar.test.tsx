import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import Navbar from '../../components/customer/Navbar';

// Mock react-router
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render logo and navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText('Rasa Minang')).toBeInTheDocument();
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Tentang Kami')).toBeInTheDocument();
  });

  it('should show Login button when not logged in', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should navigate to login page when Login button is clicked', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should not show Chat link when not logged in', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Chat link should not be visible for non-logged in users
    expect(screen.queryByText('Chat')).not.toBeInTheDocument();
  });

  it('should toggle mobile menu when menu button is clicked', async () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const menuButton = document.querySelector('button.md\\:hidden');
    expect(menuButton).toBeTruthy();
    
    if (menuButton) {
      fireEvent.click(menuButton);
      // After clicking, the mobile menu should be visible
      await waitFor(() => {
        expect(screen.getAllByText('Beranda').length).toBeGreaterThanOrEqual(2);
      });
    }
  });
});
