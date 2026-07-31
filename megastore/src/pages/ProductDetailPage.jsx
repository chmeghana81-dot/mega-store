import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProductById,
  fetchProducts,
  addRecentlyViewed,
  clearCurrentProduct,
} from '../redux/features/productsSlice'
import { addToCart } from '../redux/features/cartSlice'
import { addToWishlist, removeFromWishlist } from '../redux/features/wishlistSlice'
import Breadcrumb from '../components/common/Breadcrumb'
import StarRating from '../components/common/StarRating'
import Badge from '../components/common/Badge'
import ProductGrid from '../components/product/ProductGrid'
import { ProductDetailSkeleton } from '../components/common/Skeleton'
import {
  FiShoppingCart,
  FiHeart,
  FiZap,
  FiPackage,
  FiTruck,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiShare2,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { formatPrice, getDiscountedPrice, getStockStatus, categoryDisplayName } from '../utils/helpers'

const ProductDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentProduct: product, items: products, loading } = useSelector((s) => s.products)
  const wishlistItems = useSelector((s) => s.wishlist.items)
  const cartItems = useSelector((s) => s.cart.items)
  const isWishlisted = wishlistItems.some((i) => i.id === product?.id)
  const inCart = cartItems.some((i) => i.id === product?.id)

  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    dispatch(fetchProductById(id))
    if (!products.length) dispatch(fetchProducts({ limit: 194, skip: 0 }))
    setActiveImage(0)
    setQuantity(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return () => dispatch(clearCurrentProduct())
  }, [id, dispatch])

  useEffect(() => {
    if (product) dispatch(addRecentlyViewed(product))
  }, [product, dispatch])

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <ProductDetailSkeleton />
      </div>
    )
  }

  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage)
  const stock = getStockStatus(product.stock)
  const images = product.images?.length ? product.images : [product.thumbnail]
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 8)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) dispatch(addToCart(product))
    toast.success(`${product.title} added to cart!`)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/cart')
  }

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id))
      toast('Removed from wishlist', { icon: '💔' })
    } else {
      dispatch(addToWishlist(product))
      toast.success('Added to wishlist!')
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const prevImage = () => setActiveImage((p) => (p - 1 + images.length) % images.length)
  const nextImage = () => setActiveImage((p) => (p + 1) % images.length)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        crumbs={[
          { label: 'Products', to: '/products' },
          { label: categoryDisplayName(product.category), to: `/categories/${product.category}` },
          { label: product.title },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-6">
        {/* ─── Image Gallery ─── */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden group aspect-square flex items-center justify-center">
            <img
              src={images[activeImage]}
              alt={product.title}
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-700/80 rounded-full shadow hover:bg-white transition-colors"
                >
                  <FiChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-700/80 rounded-full shadow hover:bg-white transition-colors"
                >
                  <FiChevronRight />
                </button>
              </>
            )}
            {product.discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                -{Math.round(product.discountPercentage)}% OFF
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    i === activeImage
                      ? 'border-indigo-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-1 bg-gray-50 dark:bg-gray-800" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Product Info ─── */}
        <div className="space-y-5">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge label={categoryDisplayName(product.category)} color="indigo" />
            {product.brand && <Badge label={product.brand} color="gray" />}
            <Badge
              label={stock.label}
              color={stock.color === 'green' ? 'green' : stock.color === 'yellow' ? 'yellow' : 'red'}
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            {product.title}
          </h1>

          <StarRating rating={product.rating} size="md" showCount count={product.reviews?.length || 0} />

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {formatPrice(discountedPrice)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  You save {formatPrice(product.price - discountedPrice)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
            {product.description}
          </p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Brand', value: product.brand || 'N/A' },
              { label: 'Category', value: categoryDisplayName(product.category) },
              { label: 'Stock', value: `${product.stock} units` },
              { label: 'SKU', value: product.sku || `#${product.id}` },
              { label: 'Weight', value: product.weight ? `${product.weight}g` : 'N/A' },
              { label: 'Warranty', value: product.warrantyInformation || 'N/A' },
            ].map((spec) => (
              <div key={spec.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <span className="text-gray-400 text-xs uppercase tracking-wide">{spec.label}</span>
                <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">{spec.value}</p>
              </div>
            ))}
          </div>

          {/* Shipping info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4">
            <span className="flex items-center gap-1.5">
              <FiTruck size={15} className="text-indigo-500" />
              {product.shippingInformation || 'Free Shipping'}
            </span>
            <span className="flex items-center gap-1.5">
              <FiRefreshCw size={15} className="text-green-500" />
              {product.returnPolicy || '30-day Returns'}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Qty:</span>
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 font-bold"
              >
                −
              </button>
              <span className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 min-w-[2.5rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={product.stock === 0}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 font-bold disabled:opacity-40"
              >
                +
              </button>
            </div>
            <span className="text-xs text-gray-400">{product.stock} available</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || inCart}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all text-sm ${
                inCart
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-200 dark:border-green-800'
                  : product.stock === 0
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-md'
              }`}
            >
              <FiShoppingCart size={16} />
              {inCart ? 'In Cart' : 'Add to Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all text-sm shadow-md active:scale-95"
            >
              <FiZap size={16} />
              Buy Now
            </button>
            <button
              onClick={handleWishlist}
              className={`p-3 rounded-xl border transition-colors ${
                isWishlisted
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800 text-red-500'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-300 hover:text-red-400'
              }`}
            >
              <FiHeart size={18} />
            </button>
            <button
              onClick={handleShare}
              className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
            >
              <FiShare2 size={18} />
            </button>
          </div>

          {/* Availability guarantee */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
            <FiPackage size={14} className="text-indigo-500 flex-shrink-0" />
            <span>
              {product.availabilityStatus || (product.stock > 0 ? 'In Stock — Ready to ship' : 'Currently out of stock')}
            </span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Customer Reviews ({product.reviews.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((review, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{review.reviewerName}</span>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Related Products</h2>
            <Link
              to={`/categories/${product.category}`}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All
            </Link>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  )
}

export default ProductDetailPage
