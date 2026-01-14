import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFilter from '../../components/customer/CategoryFilter';

describe('CategoryFilter', () => {
  const mockCategories = [
    { id: 1, name: 'Makanan Utama', description: 'Main dishes' },
    { id: 2, name: 'Minuman', description: 'Beverages' },
    { id: 3, name: 'Snack', description: 'Snacks' },
  ];

  it('should render "Semua Menu" button', () => {
    const onSelectCategory = vi.fn();
    render(
      <CategoryFilter 
        categories={mockCategories} 
        selectedCategory={null} 
        onSelectCategory={onSelectCategory} 
      />
    );

    expect(screen.getByText('Semua Menu')).toBeInTheDocument();
  });

  it('should render all category buttons', () => {
    const onSelectCategory = vi.fn();
    render(
      <CategoryFilter 
        categories={mockCategories} 
        selectedCategory={null} 
        onSelectCategory={onSelectCategory} 
      />
    );

    expect(screen.getByText('Makanan Utama')).toBeInTheDocument();
    expect(screen.getByText('Minuman')).toBeInTheDocument();
    expect(screen.getByText('Snack')).toBeInTheDocument();
  });

  it('should call onSelectCategory with null when "Semua Menu" is clicked', () => {
    const onSelectCategory = vi.fn();
    render(
      <CategoryFilter 
        categories={mockCategories} 
        selectedCategory={1} 
        onSelectCategory={onSelectCategory} 
      />
    );

    fireEvent.click(screen.getByText('Semua Menu'));
    expect(onSelectCategory).toHaveBeenCalledWith(null);
  });

  it('should call onSelectCategory with category id when a category is clicked', () => {
    const onSelectCategory = vi.fn();
    render(
      <CategoryFilter 
        categories={mockCategories} 
        selectedCategory={null} 
        onSelectCategory={onSelectCategory} 
      />
    );

    fireEvent.click(screen.getByText('Makanan Utama'));
    expect(onSelectCategory).toHaveBeenCalledWith(1);
  });

  it('should highlight selected category', () => {
    const onSelectCategory = vi.fn();
    render(
      <CategoryFilter 
        categories={mockCategories} 
        selectedCategory={1} 
        onSelectCategory={onSelectCategory} 
      />
    );

    const selectedButton = screen.getByText('Makanan Utama');
    expect(selectedButton).toHaveClass('bg-green-600');
    expect(selectedButton).toHaveClass('text-white');
  });

  it('should highlight "Semua Menu" when no category is selected', () => {
    const onSelectCategory = vi.fn();
    render(
      <CategoryFilter 
        categories={mockCategories} 
        selectedCategory={null} 
        onSelectCategory={onSelectCategory} 
      />
    );

    const semuaMenuButton = screen.getByText('Semua Menu');
    expect(semuaMenuButton).toHaveClass('bg-green-600');
    expect(semuaMenuButton).toHaveClass('text-white');
  });

  it('should render with empty categories', () => {
    const onSelectCategory = vi.fn();
    render(
      <CategoryFilter 
        categories={[]} 
        selectedCategory={null} 
        onSelectCategory={onSelectCategory} 
      />
    );

    expect(screen.getByText('Semua Menu')).toBeInTheDocument();
  });
});
