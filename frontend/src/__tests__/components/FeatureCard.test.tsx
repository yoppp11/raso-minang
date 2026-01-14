import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeatureCard from '../../components/customer/FeatureCard';
import { Coffee } from 'lucide-react';

describe('FeatureCard', () => {
  it('should render title and description', () => {
    render(
      <FeatureCard 
        title="Test Title" 
        description="Test Description" 
        icon={Coffee} 
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render icon', () => {
    const { container } = render(
      <FeatureCard 
        title="Test" 
        description="Test" 
        icon={Coffee} 
      />
    );

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should use default icon color', () => {
    const { container } = render(
      <FeatureCard 
        title="Test" 
        description="Test" 
        icon={Coffee} 
      />
    );

    const iconContainer = container.querySelector('.bg-green-100');
    expect(iconContainer).toBeInTheDocument();
  });

  it('should use custom icon color when provided', () => {
    const { container } = render(
      <FeatureCard 
        title="Test" 
        description="Test" 
        icon={Coffee} 
        iconColor="bg-blue-100 text-blue-600"
      />
    );

    const iconContainer = container.querySelector('.bg-blue-100');
    expect(iconContainer).toBeInTheDocument();
  });

  it('should have hover effect by default', () => {
    const { container } = render(
      <FeatureCard 
        title="Test" 
        description="Test" 
        icon={Coffee} 
      />
    );

    const card = container.firstChild;
    expect(card).toHaveClass('hover:shadow-xl');
  });

  it('should not have hover effect when hoverEffect is false', () => {
    const { container } = render(
      <FeatureCard 
        title="Test" 
        description="Test" 
        icon={Coffee} 
        hoverEffect={false}
      />
    );

    const card = container.firstChild;
    expect(card).not.toHaveClass('hover:shadow-xl');
  });
});
