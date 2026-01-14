import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import FloatingChatButton from '../../components/customer/FloatingChatButton';

// Mock react-router
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('FloatingChatButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should not render when user is not logged in', () => {
    render(
      <BrowserRouter>
        <FloatingChatButton />
      </BrowserRouter>
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
