import { ChangeEvent } from "react"

export interface MenuItem {
    id: number
    name: string
    description: string
    price: number
    image_url: string
    is_avaible: boolean
    category_id: number
    is_spicy: boolean
    Category?: {
        id?: number
        name?: string
    }
    createdAt?: string
    updatedAt?: string
}

export interface Category {
    id: number
    name: string
}

export interface CartItem {
    id: number
    cart_id: number
    menu_item_id: number
    quantity: number
    special_instructions: string
    Menu_Item: MenuItem
}

export interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    loading?: boolean
    className?: string
}

export interface SectionTitleProps {
    title: string;
    subtitle?: string;
    centered?: boolean;
    titleColor?: string;
    subtitleColor?: string;
}

export interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    iconColor?: string;
    hoverEffect?: boolean;
}

export interface StatCardProps {
    number: string;
    label: string;
    description: string;
    numberColor?: string;
    labelColor?: string;
    descriptionColor?: string;
}

export interface TeamMemberProps {
    name: string;
    position: string;
    image_url: string;
    description: string;
    socialLinks?: {
      linkedin?: string;
      instagram?: string;
      twitter?: string;
    };
}

export interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | undefined;
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export interface SelectOption {
    value: number | undefined
    label: string
}

export interface FormDataInput {
    name: string
    description: string
    price: string
    category: string
    image: File | null | string
    isSpicy: boolean
    isAvailable: boolean
}

export interface FormErrors {
    name?: string
    description?: string
    price?: string
    category?: string
    image?: string
    isSpicy?: boolean
    isAvailable?: boolean
}

export interface CardProps {
    children: React.ReactNode
    className?: string
}

  
export interface InputProps {
    label?: string
    error?: string
    required?: boolean
    className?: string
    value?: string
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    type?: string
    min?: string
    step?: string
    icon?: React.ComponentType<any>;
}
  
export interface TextAreaProps {
    label?: string
    error?: string
    required?: boolean
    className?: string
    rows?: number
    value?: string
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
    placeholder?: string
}
  
export interface SelectProps {
    label?: string
    error?: string
    required?: boolean
    options?: SelectOption[]
    className?: string
    value?: string
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void
}
  
export interface ImageUploadProps {
    onImageChange: (file: File | null) => void
    preview: string | null
    error?: string
}
  
export interface ToggleProps {
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
    description?: string
}

declare global {
    interface Window {
      snap: {
        pay: (
          token: string,
          callbacks: {
            onSuccess?: (result: any) => void;
            onPending?: (result: any) => void;
            onError?: (result: any) => void;
            onClose?: () => void;
          }
        ) => void;
      };
    }
}

export interface PaymentResponse {
    token: string
    paymentId: string
    totalAmount: number
}

export interface MenuItemOrder {
    id: number;
    name: string;
    image_url: string;
}
  
export interface OrderItem {
    id: number;
    order_id: number;
    menu_item_id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
    special_instructions: string;
    createdAt: string;
    updatedAt: string;
    Menu_Item: MenuItemOrder;
  }

export interface Order {
    id: number;
    user_id: number;
    order_status: 'Menunggu' | 'Diproses' | 'Dimasak' | 'Siap' | 'Dalam Perjalanan' | 'Selesai' | 'Dibatalkan';
    order_type: 'Delivery' | 'Pickup';
    total_amount: number;
    delivery_address: string;
    payment_status: 'Menunggu' | 'Lunas' | 'Gagal' | 'Dibatalkan';
    notes: string;
    createdAt: string;
    updatedAt: string;
    Order_Items: OrderItem[];
    User?: {
        id: number;
        username: string;
        email: string;
        full_name?: string;
    };
  }
  
export interface ApiResponse {
    success: boolean;
    data: Order[];
    message?: string;
}

 export interface FilterOptions {
    category: string;
    isSpicy: boolean | null;
    isAvaible: boolean | null;
    priceRange: [number, number];
    sortBy: 'name' | 'price' | 'rating';
    sortOrder: 'asc' | 'desc';
  }

// Chat types
export interface Conversation {
    id: number;
    user_id: number;
    status: 'active' | 'closed';
    last_message: string | null;
    last_message_at: string | null;
    createdAt: string;
    updatedAt: string;
    User?: User;
    Messages?: Message[];
    unreadCount?: number;
}

export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    sender_role: 'user' | 'admin' | 'superadmin';
    content: string;
    is_read: boolean;
    createdAt: string;
    updatedAt: string;
    Sender?: {
        id: number;
        username: string;
        full_name: string;
        role: string;
    };
}

export interface User {
    id: number;
    username: string;
    email: string;
    full_name?: string;
    phone_number?: string;
    address?: string;
    role: 'user' | 'admin' | 'superadmin';
    createdAt?: string;
    updatedAt?: string;
}

// Super Admin Stats
export interface DashboardStats {
    totalUsers: number;
    totalAdmins: number;
    totalOrders: number;
    totalRevenue: number;
    totalMenuItems: number;
    totalCategories: number;
    ordersThisMonth: number;
    revenueThisMonth: number;
    ordersToday: number;
    pendingOrders: number;
    unreadMessages: number;
    recentOrders: Order[];
}

export interface PaginationData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}