// Product Types
export interface Product {
    id: string
    name: string
    slug: string
    description: string
    base_price: number
    gender: 'men' | 'women' | 'unisex'
    category_id: string
    is_featured: boolean
    stock_quantity: number
    created_at: string
    updated_at: string
    category?: Category
    images?: ProductImage[]
    variants?: ProductVariant[]
}

export interface ProductImage {
    id: string
    product_id: string
    image_url: string
    is_primary: boolean
    display_order: number
    created_at: string
}

export interface ProductVariant {
    id: string
    product_id: string
    size?: string
    color?: string
    stock: number
    price_adjustment: number
    created_at: string
}

// Category Types
export interface Category {
    id: string
    name: string
    slug: string
    description?: string
    created_at: string
}

// Catalogue Types
export interface Catalogue {
    id: string
    name: string
    slug: string
    description?: string
    is_active: boolean
    created_at: string
}

// Order Types
export interface Order {
    id: string
    order_number: string
    customer_email: string
    customer_name: string
    customer_phone: string
    shipping_address: string
    subtotal: number
    shipping_cost: number
    total: number
    payment_method: 'cod'
    payment_status: 'pending' | 'paid' | 'failed'
    fulfillment_status: 'unfulfilled' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
    created_at: string
    items?: OrderItem[]
}

export interface OrderItem {
    id: string
    order_id: string
    product_id: string
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
    size?: string
    color?: string
    created_at: string
}

// Cart Types
export interface CartItem {
    product: Product
    quantity: number
    size?: string
    color?: string
}

// Filter Types
export interface ProductFilters {
    category?: string
    gender?: string
    minPrice?: number
    maxPrice?: number
    size?: string
    color?: string
    search?: string
    sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'featured'
}

// Stats Types
export interface DashboardStats {
    totalRevenue: number
    totalOrders: number
    pendingOrders: number
    completedOrders: number
    totalProducts: number
    lowStockProducts: number
}

export interface TopProduct {
    product_id: string
    product_name: string
    total_quantity: number
    total_revenue: number
}
