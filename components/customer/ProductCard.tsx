import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const primaryImage = product.images?.find((img) => img.is_primary)?.image_url ||
        product.images?.[0]?.image_url ||
        '/placeholder-product.jpg'

    return (
        <Link href={`/product/${product.slug}`} className="group">
            <div className="product-card">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-neutral-900">
                    <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Featured Badge */}
                    {product.is_featured && (
                        <div className="absolute top-2 left-2 bg-white text-black text-xs font-bold px-2 py-1 rounded">
                            FEATURED
                        </div>
                    )}

                    {/* Out of Stock Overlay */}
                    {product.stock_quantity === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">OUT OF STOCK</span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="font-black uppercase text-white group-hover:text-neutral-300 transition-colors line-clamp-2 mb-2">
                        {product.name}
                    </h3>

                    {product.gender && (
                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                            {product.gender}
                        </p>
                    )}

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">
                            {formatPrice(product.base_price)}
                        </span>

                        {product.stock_quantity > 0 && product.stock_quantity < 5 && (
                            <span className="text-xs text-yellow-500">
                                Only {product.stock_quantity} left
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
