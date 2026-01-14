import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchInput } from '../../components/customer/SearchInput';

describe('SearchInput', () => {
  it('should render with default placeholder', () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} />);

    expect(screen.getByPlaceholderText('Cari menu...')).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} placeholder="Search here..." />);

    expect(screen.getByPlaceholderText('Search here...')).toBeInTheDocument();
  });

  it('should call onChange when typing', () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText('Cari menu...');
    fireEvent.change(input, { target: { value: 'rendang' } });

    expect(onChange).toHaveBeenCalledWith('rendang');
  });

  it('should show clear button when there is a value', () => {
    const onChange = vi.fn();
    render(<SearchInput value="test" onChange={onChange} />);

    const clearButton = screen.getByRole('button');
    expect(clearButton).toBeInTheDocument();
  });

  it('should not show clear button when value is empty', () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should clear the input when clear button is clicked', () => {
    const onChange = vi.fn();
    render(<SearchInput value="test" onChange={onChange} />);

    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);

    expect(onChange).toHaveBeenCalledWith('');
  });

  it('should apply custom className', () => {
    const onChange = vi.fn();
    const { container } = render(
      <SearchInput value="" onChange={onChange} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
