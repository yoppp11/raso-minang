export interface MenuItem {
    id: number
    name: string
    description: string
    price: number
    image_url: string
    is_avaible: boolean
    category_id: number
    is_spicy: boolean
    createdAt: string
    updatedAt: string
}

export interface Category {
    id: number
    name: string
}