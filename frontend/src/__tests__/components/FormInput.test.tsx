import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FormInput from '../../components/customer/FormInput'

describe('FormInput Component', () => {
  const defaultProps = {
    id: 'test-input',
    name: 'testInput',
    type: 'text',
    label: 'Test Label',
    placeholder: 'Enter text...',
    icon: <span data-testid="icon">📧</span>,
    value: '',
    onChange: vi.fn()
  }

  it('renders with label correctly', () => {
    render(<FormInput {...defaultProps} />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('renders input with placeholder', () => {
    render(<FormInput {...defaultProps} />)
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument()
  })

  it('renders icon', () => {
    render(<FormInput {...defaultProps} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('displays the value correctly', () => {
    render(<FormInput {...defaultProps} value="test value" />)
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument()
  })

  it('calls onChange when typing', () => {
    const handleChange = vi.fn()
    render(<FormInput {...defaultProps} onChange={handleChange} />)
    
    const input = screen.getByPlaceholderText('Enter text...')
    fireEvent.change(input, { target: { value: 'new value' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('applies correct input type', () => {
    render(<FormInput {...defaultProps} type="email" />)
    const input = screen.getByPlaceholderText('Enter text...')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('sets required attribute when required prop is true', () => {
    render(<FormInput {...defaultProps} required />)
    const input = screen.getByPlaceholderText('Enter text...')
    expect(input).toBeRequired()
  })

  it('renders right element when provided', () => {
    render(
      <FormInput 
        {...defaultProps} 
        rightElement={<button data-testid="right-element">Toggle</button>}
      />
    )
    expect(screen.getByTestId('right-element')).toBeInTheDocument()
  })

  it('has correct id attribute', () => {
    render(<FormInput {...defaultProps} />)
    const input = screen.getByPlaceholderText('Enter text...')
    expect(input).toHaveAttribute('id', 'test-input')
  })

  it('has correct name attribute', () => {
    render(<FormInput {...defaultProps} />)
    const input = screen.getByPlaceholderText('Enter text...')
    expect(input).toHaveAttribute('name', 'testInput')
  })

  it('label is linked to input via htmlFor', () => {
    render(<FormInput {...defaultProps} />)
    const label = screen.getByText('Test Label')
    expect(label).toHaveAttribute('for', 'test-input')
  })
})
