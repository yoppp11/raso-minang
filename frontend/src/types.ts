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

export interface InputProps {
    type?: string
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    icon?: React.ComponentType<{ className?: string }>
    error?: string
    required?: boolean
    className?: string
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