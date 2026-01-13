import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import MenuCard from '../../components/customer/MenuCard'
import { MenuItem } from '../../types'

// Mock axios
vi.mock('../../helpers/axios', () => ({
  http: vi.fn()
}))

// Mock Swal
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn()
  }
}))

const mockNavigate = vi.fn()
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('MenuCard Component', () => {
  const mockItem: MenuItem = {
    id: 1,
    name: 'Rendang',
    description: 'Delicious beef rendang with rich spices',
    price: 50000,
    image_url: 'https://example.com/rendang.jpg',
    is_avaible: true,
    is_spicy: true,
    category_id: 1,
    Category: {
      id: 1,
      name: 'Main Course'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  const renderWithRouter = (component: React.ReactNode) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    )
  }

  it('renders menu item name', () => {
    renderWithRouter(<MenuCard item={mockItem} />)
    expect(screen.getByText('Rendang')).toBeInTheDocument()
  })

  it('renders menu item description', () => {
    renderWithRouter(<MenuCard item={mockItem} />)
    expect(screen.getByText('Delicious beef rendang with rich spices')).toBeInTheDocument()
  })

  it('renders menu item image', () => {
    renderWithRouter(<MenuCard item={mockItem} />)
    const image = screen.getByAltText('Rendang')
    expect(image).toHaveAttribute('src', 'https://example.com/rendang.jpg')
  })

  it('shows unavailable overlay when item is not available', () => {
    const unavailableItem = { ...mockItem, is_avaible: false }
    renderWithRouter(<MenuCard item={unavailableItem} />)
    // Use getAllByText since "Tidak Tersedia" appears twice (overlay and button)
    const unavailableElements = screen.getAllByText('Tidak Tersedia')
    expect(unavailableElements.length).toBeGreaterThan(0)
  })

  it('does not show unavailable overlay when item is available', () => {
    renderWithRouter(<MenuCard item={mockItem} />)
    expect(screen.queryByText('Tidak Tersedia')).not.toBeInTheDocument()
  })

  it('navigates to menu detail when card is clicked', () => {
    renderWithRouter(<MenuCard item={mockItem} />)
    const card = screen.getByText('Rendang').closest('div')
    if (card?.parentElement) {
      fireEvent.click(card.parentElement)
      expect(mockNavigate).toHaveBeenCalledWith('/1')
    }
  })

  it('renders add to cart button when item is available', () => {
    renderWithRouter(<MenuCard item={mockItem} />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })
})
