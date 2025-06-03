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
    Category: {
        id: number
        name: string
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
    image: File | null
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