import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PriceFormatter from '../../components/customer/PriceFormatter';

describe('PriceFormatter', () => {
  it('should format price with Indonesian currency', () => {
    render(<PriceFormatter price={50000} />);
    expect(screen.getByText(/Rp\s*50\.000/)).toBeInTheDocument();
  });

  it('should format large price correctly', () => {
    render(<PriceFormatter price={1500000} />);
    expect(screen.getByText(/Rp\s*1\.500\.000/)).toBeInTheDocument();
  });

  it('should format zero price', () => {
    render(<PriceFormatter price={0} />);
    expect(screen.getByText(/Rp\s*0/)).toBeInTheDocument();
  });

  it('should have font-semibold class', () => {
    const { container } = render(<PriceFormatter price={50000} />);
    const span = container.querySelector('span');
    expect(span).toHaveClass('font-semibold');
  });
});
