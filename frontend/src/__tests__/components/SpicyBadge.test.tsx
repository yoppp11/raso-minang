import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SpicyBadge from '../../components/customer/SpicyBadge';

describe('SpicyBadge', () => {
  it('should render the badge when isSpicy is true', () => {
    render(<SpicyBadge isSpicy={true} />);
    expect(screen.getByText('Pedas')).toBeInTheDocument();
  });

  it('should not render when isSpicy is false', () => {
    render(<SpicyBadge isSpicy={false} />);
    expect(screen.queryByText('Pedas')).not.toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    const { container } = render(<SpicyBadge isSpicy={true} />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-red-500');
    expect(badge).toHaveClass('text-white');
  });

  it('should have proper sizing', () => {
    const { container } = render(<SpicyBadge isSpicy={true} />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('text-xs');
    expect(badge).toHaveClass('rounded-full');
  });
});
