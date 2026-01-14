import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsCard from '../../components/admin/StatsCard';
import { ShoppingCart, Users, DollarSign, Package } from 'lucide-react';

describe('StatsCard', () => {
  it('should render title and value', () => {
    render(
      <StatsCard 
        title="Total Orders" 
        value="150" 
        icon={ShoppingCart} 
      />
    );

    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('should render icon', () => {
    const { container } = render(
      <StatsCard 
        title="Users" 
        value="50" 
        icon={Users} 
      />
    );

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should render change when provided', () => {
    render(
      <StatsCard 
        title="Revenue" 
        value="Rp 5.000.000" 
        change="+12% from last month"
        icon={DollarSign} 
      />
    );

    expect(screen.getByText('+12% from last month')).toBeInTheDocument();
  });

  it('should not render change when not provided', () => {
    render(
      <StatsCard 
        title="Products" 
        value="25" 
        icon={Package} 
      />
    );

    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });

  it('should apply green color by default', () => {
    const { container } = render(
      <StatsCard 
        title="Test" 
        value="100" 
        icon={ShoppingCart} 
      />
    );

    const iconContainer = container.querySelector('.bg-green-100');
    expect(iconContainer).toBeInTheDocument();
  });

  it('should apply blue color when specified', () => {
    const { container } = render(
      <StatsCard 
        title="Test" 
        value="100" 
        icon={ShoppingCart} 
        color="blue"
      />
    );

    const iconContainer = container.querySelector('.bg-blue-100');
    expect(iconContainer).toBeInTheDocument();
  });

  it('should apply yellow color when specified', () => {
    const { container } = render(
      <StatsCard 
        title="Test" 
        value="100" 
        icon={ShoppingCart} 
        color="yellow"
      />
    );

    const iconContainer = container.querySelector('.bg-yellow-100');
    expect(iconContainer).toBeInTheDocument();
  });

  it('should apply red color when specified', () => {
    const { container } = render(
      <StatsCard 
        title="Test" 
        value="100" 
        icon={ShoppingCart} 
        color="red"
      />
    );

    const iconContainer = container.querySelector('.bg-red-100');
    expect(iconContainer).toBeInTheDocument();
  });
});
